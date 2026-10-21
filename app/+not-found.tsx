import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';

import { CAMPUS } from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CAMPUS.bg, justifyContent: 'center', alignItems: 'center' },
  button: { fontSize: 20, textDecorationLine: 'underline', color: CAMPUS.text },
});
