import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import CampusBackground from '@/components/CampusBackground';
import { CAMPUS } from '@/constants/colors';
import { signIn } from '@/lib/auth';
import { LIMITS, validateEmail } from '@/lib/validation';

type Field = 'email' | 'password';

/* Navy fill used inside the Sign In button */
function ButtonGradient() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="campusBtn" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={CAMPUS.primary} />
          <Stop offset="1" stopColor={CAMPUS.primaryDeep} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#campusBtn)" />
      </Svg>
    </View>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Look-and-feel only state
  const [focused, setFocused] = useState<Field | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    setError(null);

    // Input validation (before anything is sent to the server)
    const emailCheck = validateEmail(email);
    if (!emailCheck.ok) {
      setError(emailCheck.message);
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await signIn(emailCheck.value, password);

      if (authError) {
        setError(authError.message);
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CampusBackground />

      <KeyboardAvoidingView
        style={styles.keyboardView}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
keyboardVerticalOffset={0}
      >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: insets.top + 44 },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            {/* Brand */}
            <View style={styles.brand}>
              <View style={styles.scanBox}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                <Ionicons name="qr-code-outline" size={38} color={CAMPUS.accent} />
              </View>

              <View style={styles.statusPill}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Student Hub</Text>
              </View>

              <Text style={styles.appName}>QR Attendance</Text>
              <Text style={styles.tagline}>
                Scan in. Show up. Stay on record.
              </Text>
            </View>

            {/* Glass card */}
            <View style={styles.card}>
              <Text style={styles.title}>Sign in</Text>
              <Text style={styles.subtitle}>
                Sign in to record your attendance
              </Text>

              <Text style={styles.label}>EMAIL</Text>
              <Pressable
                onPress={() => emailRef.current?.focus()}
                style={[
                  styles.inputWrap,
                  focused === 'email' && styles.inputWrapFocused,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color={focused === 'email' ? CAMPUS.accent : CAMPUS.textMuted}
                />
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@school.edu"
                  placeholderTextColor={CAMPUS.textFaint}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  maxLength={LIMITS.email}
                  editable={!loading}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
              </Pressable>

              <Text style={styles.label}>PASSWORD</Text>
              <Pressable
                onPress={() => passwordRef.current?.focus()}
                style={[
                  styles.inputWrap,
                  focused === 'password' && styles.inputWrapFocused,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color={
                    focused === 'password' ? CAMPUS.accent : CAMPUS.textMuted
                  }
                />
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={CAMPUS.textFaint}
                  secureTextEntry={!showPassword}
                  maxLength={LIMITS.password}
                  editable={!loading}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={16}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={19}
                    color={CAMPUS.textMuted}
                  />
                </Pressable>
              </Pressable>

              {error && (
                <View style={styles.errorBox}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color={CAMPUS.danger}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  loading && styles.buttonLoading,
                ]}
                onPress={handleLogin}
                disabled={loading}
                accessibilityRole="button"
              >
                <ButtonGradient />
                {loading ? (
                  <ActivityIndicator size="small" color={CAMPUS.onPrimary} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={20} color={CAMPUS.onPrimary} />
                  </>
                )}
              </Pressable>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href="/register" asChild>
                <Pressable
                  hitSlop={14}
                  style={styles.linkButton}
                  accessibilityRole="link"
                >
                  <Text style={styles.link}>Sign Up</Text>
                </Pressable>
              </Link>
            </View>

            <View style={styles.secureRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color={CAMPUS.textFaint}
              />
              <Text style={styles.secureText}>SECURE SIGN-IN</Text>
            </View>
          </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CAMPUS.bg,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  /* Brand */
  brand: {
    alignItems: 'center',
    marginBottom: 28,
  },
  scanBox: {
    width: 92,
    height: 92,
    borderRadius: 24,
    backgroundColor: CAMPUS.accentSoft,
    borderWidth: 1,
    borderColor: CAMPUS.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: CAMPUS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 8,
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: CAMPUS.accent,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: CAMPUS.surface,
    borderWidth: 1,
    borderColor: CAMPUS.border,
    marginBottom: 14,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: CAMPUS.mint,
  },
  statusText: {
    fontFamily: CAMPUS.mono,
    fontSize: 11,
    letterSpacing: 1.6,
    color: CAMPUS.textMuted,
    fontWeight: '600',
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: CAMPUS.text,
    letterSpacing: 0.2,
  },
  tagline: {
    fontSize: 14,
    color: CAMPUS.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },

  /* Glass card */
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: CAMPUS.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: CAMPUS.border,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
    // frosted-glass blur where supported (web)
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(16px)' } as object)
      : null),
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: CAMPUS.text,
  },
  subtitle: {
    fontSize: 14,
    color: CAMPUS.textMuted,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 10,
  },
  label: {
    fontFamily: CAMPUS.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: CAMPUS.textMuted,
    marginBottom: 8,
    marginTop: 16,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: CAMPUS.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CAMPUS.border,
    paddingHorizontal: 14,
  },
  inputWrapFocused: {
    borderColor: CAMPUS.accent,
    backgroundColor: CAMPUS.accentFaint,
    shadowColor: CAMPUS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: CAMPUS.text,
    // removes the default browser outline on web; the glow border shows focus
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null),
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: CAMPUS.dangerBg,
    borderWidth: 1,
    borderColor: CAMPUS.dangerBorder,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: CAMPUS.danger,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CAMPUS.primaryBorder,
    shadowColor: CAMPUS.primaryDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  buttonLoading: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: CAMPUS.onPrimary,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: CAMPUS.textMuted,
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  link: {
    color: CAMPUS.accent,
    fontWeight: '700',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 22,
  },
  secureText: {
    fontFamily: CAMPUS.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    color: CAMPUS.textFaint,
  },
});