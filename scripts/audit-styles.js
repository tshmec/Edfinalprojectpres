/* AST-based audit using the TypeScript compiler API.
   Detects: unused StyleSheet keys, duplicate object-literal keys, unused imports. */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const DIRS = ['app', 'components', 'lib', 'constants'];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(e.name)) out.push(full);
  }
  return out;
}

const files = DIRS.flatMap((d) => walk(path.join(ROOT, d)));
let findings = 0;

for (const file of files) {
  const srcText = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const sf = ts.createSourceFile(
    file,
    srcText,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  const styleKeys = new Map(); // name -> count of declarations
  const usedStyles = new Set();
  const dupes = new Map();    // key -> locations
  const importNames = new Map(); // local name -> import declaration

  const visit = (node) => {
    // --- StyleSheet.create({...}) ---
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.getText(sf) === 'StyleSheet' &&
      node.expression.name.text === 'create' &&
      node.arguments.length > 0 &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      const obj = node.arguments[0];
      for (const prop of obj.properties) {
        if (ts.isPropertyAssignment(prop) || ts.isShorthandPropertyAssignment(prop)) {
          const name = prop.name.getText(sf).replace(/^['"]|['"]$/g, '');
          styleKeys.set(name, (styleKeys.get(name) || 0) + 1);
        }
      }
    }

    // --- styles.X usage ---
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'styles'
    ) {
      usedStyles.add(node.name.text);
    }
    // styles['X']
    if (
      ts.isElementAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'styles' &&
      node.argumentExpression &&
      ts.isStringLiteral(node.argumentExpression)
    ) {
      usedStyles.add(node.argumentExpression.text);
    }

    // --- duplicate keys in any object literal ---
    if (ts.isObjectLiteralExpression(node)) {
      const seen = new Map();
      for (const prop of node.properties) {
        if (ts.isPropertyAssignment(prop) || ts.isShorthandPropertyAssignment(prop)) {
          const name = prop.name.getText(sf).replace(/^['"]|['"]$/g, '');
          if (seen.has(name)) {
            if (!dupes.has(name)) dupes.set(name, []);
            dupes.get(name).push(node.properties.indexOf(prop));
          }
          seen.set(name, true);
        }
      }
    }

    // --- import bindings ---
    if (ts.isImportDeclaration(node) && node.importClause) {
      const ic = node.importClause;
      if (ic.namedBindings && ts.isNamedImports(ic.namedBindings)) {
        for (const el of ic.namedBindings.elements) {
          const local = el.name.text;
          importNames.set(local, node);
        }
      }
      if (ic.name) importNames.set(ic.name.text, node);
    }

    ts.forEachChild(node, visit);
  };
  visit(sf);

  const report = [];

  // unused style keys
  const unusedStyles = [...styleKeys.keys()].filter((k) => !usedStyles.has(k));
  if (unusedStyles.length) report.push('  UNUSED style keys    : ' + unusedStyles.join(', '));

  // duplicated style keys (declared twice in the same StyleSheet.create)
  const dupeStyles = [...styleKeys.entries()].filter(([, c]) => c > 1).map(([k]) => k);
  if (dupeStyles.length) report.push('  DUPLICATE style keys : ' + dupeStyles.join(', '));

  // duplicate object literal keys anywhere
  const dupeObjs = [...dupes.keys()];
  if (dupeObjs.length) {
    report.push('  DUPLICATE obj keys   : ' + dupeObjs.join(', '));
  }

  // unused imports
  const unusedImports = [];
  for (const [name] of importNames) {
    let count = 0;
    const re = new RegExp(`\\b${name.replace(/\$/g, '\\$')}\\b`, 'g');
    const all = srcText.match(re);
    count = all ? all.length : 0;
    // 1 occurrence == the import itself only
    if (count <= 1) unusedImports.push(name);
  }
  if (unusedImports.length) report.push('  UNUSED imports       : ' + unusedImports.join(', '));

  if (report.length) {
    console.log(`\n=== ${rel} ===`);
    report.forEach((r) => console.log(r));
    findings++;
  }
}

console.log(`\n--- files with findings: ${findings} ---`);

/* ------------------------------------------------------------------ */
/* Cross-file analysis: orphaned modules + unused exports               */
/* ------------------------------------------------------------------ */

const ALL_SRC = files.map((f) => ({
  file: f,
  rel: path.relative(ROOT, f).replace(/\\/g, '/'),
  text: fs.readFileSync(f, 'utf8'),
}));

// --- orphaned modules: exported default/named symbols never imported elsewhere ---
console.log('\n=== ORPHANED MODULES (never imported by any other file) ===');
for (const f of ALL_SRC) {
  if (!f.rel.startsWith('components/')) continue;
  const base = path.basename(f.file, path.extname(f.file));
  // find import statements across all OTHER files that reference this module
  const referenced = ALL_SRC.some((other) => {
    if (other.file === f.file) return false;
    const re = new RegExp(
      `from\\s+['"][^'"]*(?:/|^)${base}['"]|require\\(['"][^'"]*(?:/|^)${base}['"]\\)`
    );
    return re.test(other.text);
  });
  if (!referenced) console.log('  ' + f.rel);
}

// --- unused exports across lib/ and constants/ ---
console.log('\n=== UNUSED EXPORTS (lib/, constants/) ===');
for (const f of ALL_SRC) {
  if (!/^(lib|constants)\//.test(f.rel)) continue;
  const sf2 = ts.createSourceFile(
    f.file, f.text, ts.ScriptTarget.Latest, true,
    f.file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  const exported = [];
  sf2.statements.forEach((st) => {
    const mods = ts.canHaveModifiers(st) ? ts.getModifiers(st) || [] : [];
    const isExported = mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExported) return;
    if (ts.isFunctionDeclaration(st) && st.name) exported.push(st.name.text);
    if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) {
        if (ts.isIdentifier(d.name)) exported.push(d.name.text);
      }
    }
    if (ts.isInterfaceDeclaration(st) && st.name) exported.push(st.name.text);
    if (ts.isTypeAliasDeclaration(st) && st.name) exported.push(st.name.text);
    if (ts.isClassDeclaration(st) && st.name) exported.push(st.name.text);
  });

  const unused = [];
  for (const name of exported) {
    // A type that is only referenced inside its own file is still part of the
    // module's public surface (e.g. the return type of an exported function),
    // so only flag it when it is unused both internally and externally.
    const external = ALL_SRC.filter((other) => other.file !== f.file)
      .map((o) => o.text).join('\n');
    const internal = f.text;

    const re = new RegExp(`\\b${name}\\b`);
    const usedExternally = re.test(external);
    const usedInternally = (internal.match(new RegExp(`\\b${name}\\b`, 'g')) || []).length > 1;

    if (!usedExternally && !usedInternally) unused.push(name);
  }
  if (unused.length) console.log(`  ${f.rel}: ${unused.join(', ')}`);
}

