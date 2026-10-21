import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import CampusBackground from '@/components/CampusBackground';
import CampusButton from '@/components/CampusButton';
import ScanLogo from '@/components/ScanLogo';
import { CAMPUS } from '@/constants/colors';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <CampusBackground />

      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <ScanLogo />

          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>STUDENT HUB</Text>
          </View>

          <Text style={styles.appName}>QR Attendance</Text>
          <Text style={styles.credit}> Developed by Toshe Mecca Munasque</Text>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.mainTitle}>School Event Attendance</Text>
          <Text style={styles.subtitle}>
            Scan QR Codes to record attendance during school activities.
          </Text>
        </View>

        <View style={styles.footerContainer}>
          <CampusButton
            variant="primary"
            title="Scan QR Code"
            icon="qr-code-outline"
            onPress={() => router.push('/scan')}
          />
          <CampusButton
            title="Attendance History"
            icon="time-outline"
            onPress={() => router.push('/history')}
          />
          <CampusButton
            title="Profile"
            icon="person-outline"
            onPress={() => router.push('/profile')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CAMPUS.bg,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
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
    marginTop: 22,
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
    fontSize: 32,
    fontWeight: '800',
    color: CAMPUS.text,
    letterSpacing: 0.2,
  },
  credit: {
    fontFamily: CAMPUS.mono,
    fontSize: 11,
    letterSpacing: 0.4,
    color: CAMPUS.textFaint,
    marginTop: 8,
    textAlign: 'center',
  },
  bodyContainer: {
    alignItems: 'flex-start',
    backgroundColor: CAMPUS.surface,
    borderWidth: 1,
    borderColor: CAMPUS.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: CAMPUS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: CAMPUS.textMuted,
    lineHeight: 21,
  },
  footerContainer: {
    gap: 12,
    width: '100%',
  },
});