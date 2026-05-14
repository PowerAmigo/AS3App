import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme';

const TONES = {
  online:  { bg: C.successBg, text: C.success,  dot: C.green },
  pending: { bg: C.warningBg, text: C.warning,  dot: '#F2A900' },
  error:   { bg: C.errorBg,   text: C.error,    dot: C.error },
  info:    { bg: C.infoBg,    text: C.info,     dot: C.cyan },
  neutral: { bg: '#EEF2F6',   text: '#3A5266',  dot: C.muted },
};

export default function StatusBadge({ children, tone = 'neutral' }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <View style={[styles.dot, { backgroundColor: t.dot }]} />
      <Text style={[styles.text, { color: t.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 4, paddingHorizontal: 10, borderRadius: 100,
    alignSelf: 'flex-start',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontWeight: '600', fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase' },
});
