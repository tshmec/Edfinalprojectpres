import { Platform } from 'react-native';

// "Quiet Terminal" palette: a deep navy canvas, neutral greys for structure,
// and a single restrained pink accent used sparingly for focus, labels and
// primary actions. Everything a screen needs should come from here so the
// accent never drifts.
export const CAMPUS = {
  /* Canvas */
  bg: '#0A0C14',
  bgDeep: '#070810',
  bgElevated: '#10131E',

  /* Neutral surfaces */
  surface: 'rgba(255,255,255,0.045)',
  surfaceStrong: 'rgba(255,255,255,0.08)',
  surfaceInset: 'rgba(0,0,0,0.28)',
  inputBg: 'rgba(255,255,255,0.035)',
  border: 'rgba(255,255,255,0.09)',
  borderStrong: 'rgba(255,255,255,0.18)',

  /* Navy brand */
  primary: '#4C5FD7',
  primaryDeep: '#3A49B0',
  primarySoft: 'rgba(76,95,215,0.14)',
  primaryBorder: 'rgba(76,95,215,0.36)',
  primaryText: '#8E9BF0',

  /* The pink accent - used sparingly */
  accent: '#FF8FB8',
  accentSoft: 'rgba(255,143,184,0.12)',
  accentBorder: 'rgba(255,143,184,0.30)',
  accentFaint: 'rgba(255,143,184,0.06)',

  /* Supporting hues (used only for role/section identification) */
  violet: '#9B8AFB',
  violetSoft: 'rgba(155,138,251,0.14)',
  violetBorder: 'rgba(155,138,251,0.34)',
  amber: '#F5B841',
  amberSoft: 'rgba(245,184,65,0.13)',
  amberBorder: 'rgba(245,184,65,0.32)',

  /* Type */
  text: '#EDF0F6',
  textMuted: '#9AA3B8',
  textFaint: '#6B7387',
  onPrimary: '#FFFFFF',

  /* Semantic */
  mint: '#3DD68C',
  mintSoft: 'rgba(61,214,140,0.12)',
  mintBorder: 'rgba(61,214,140,0.30)',

  danger: '#FF6B81',
  dangerBg: 'rgba(255,107,122,0.11)',
  dangerBorder: 'rgba(255,107,122,0.32)',
  dangerSolid: '#E0455C',

  /* Overlays */
  gridLine: 'rgba(255,255,255,0.032)',
  overlay: 'rgba(7,8,16,0.78)',
  overlaySoft: 'rgba(7,8,16,0.55)',
  sheetBg: '#0F121C',

  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  }) as string,
} as const;