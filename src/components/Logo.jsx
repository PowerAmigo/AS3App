import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { C } from '../theme';

export default function Logo({ size = 48, showText = true, dark = false }) {
  const textColor = dark ? '#fff' : C.navy;
  const subtitleColor = dark ? 'rgba(255,255,255,0.6)' : C.muted;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Path d="M32 32 L32 4 Q28 18 4 32 Z" fill={C.cyan} />
        <Path d="M32 32 L60 32 Q46 28 32 4 Z" fill={C.green} />
        <Path d="M32 32 L32 60 Q36 46 60 32 Z" fill={C.cyan} />
        <Path d="M32 32 L4 32 Q18 36 32 60 Z" fill={C.green} />
      </Svg>
      {showText && (
        <View style={{ gap: 2 }}>
          <Text style={{
            fontWeight: '800', fontSize: size * 0.42,
            color: textColor, letterSpacing: -0.5, textTransform: 'uppercase',
          }}>
            Power Amigo
          </Text>
          <Text style={{
            fontWeight: '500', fontSize: size * 0.22,
            color: subtitleColor, letterSpacing: 3, textTransform: 'uppercase',
          }}>
            Field App
          </Text>
        </View>
      )}
    </View>
  );
}
