import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  Path,
  Pattern,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { CAMPUS } from '@/constants/colors';

// Faint grid + a restrained pink glow in the corner. Sits behind a screen's
// content and stays quiet so the foreground content carries the hierarchy.
export default function CampusBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
      <Defs>
        <Pattern
          id="bgGrid"
          width="36"
          height="36"
          patternUnits="userSpaceOnUse"
        >
          <Path
            d="M36 0H0V36"
            fill="none"
            stroke={CAMPUS.gridLine}
            strokeWidth="1"
          />
        </Pattern>
        <RadialGradient id="bgGlowA" cx="88%" cy="2%" r="52%">
          <Stop offset="0" stopColor={CAMPUS.accent} stopOpacity="0.16" />
          <Stop offset="1" stopColor={CAMPUS.accent} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="bgGlowB" cx="4%" cy="98%" r="62%">
          <Stop offset="0" stopColor={CAMPUS.primary} stopOpacity="0.22" />
          <Stop offset="1" stopColor={CAMPUS.primary} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#bgGlowA)" />
      <Rect width="100%" height="100%" fill="url(#bgGlowB)" />
      <Rect width="100%" height="100%" fill="url(#bgGrid)" />
      </Svg>
    </View>
  );
}