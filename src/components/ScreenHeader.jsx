import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C } from '../theme';
import Svg, { Path } from 'react-native-svg';

function BackIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Path d="M9 2L4 7l5 5" stroke={C.navy} strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function ScreenHeader({ title, subtitle, onBack, right }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const handleBack = onBack || (() => router.back());

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={handleBack} style={styles.backBtn}>
        <BackIcon />
      </Pressable>
      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>
      {right ? right : <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingBottom: 16,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 10,
    borderWidth: 1.5, borderColor: C.borderDark, backgroundColor: C.white,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  titleBlock: { flex: 1, minWidth: 0 },
  title: {
    fontWeight: '700', fontSize: 22, color: C.navy,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontWeight: '500', fontSize: 12, color: C.muted,
    letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 2,
  },
  placeholder: { width: 40 },
});
