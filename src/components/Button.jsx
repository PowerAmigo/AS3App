import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { C } from '../theme';

const VARIANTS = {
  primary:   { bg: C.cyan,  text: '#fff', shadow: C.cyan },
  success:   { bg: C.green, text: '#fff', shadow: C.green },
  secondary: { bg: '#fff',  text: C.navy, border: C.borderDark },
  danger:    { bg: '#fff',  text: C.error, border: '#FDE5E5' },
  ghost:     { bg: 'transparent', text: C.navy },
};

export default function Button({
  children, onPress, variant = 'primary', disabled, loading, style,
}) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: disabled ? C.borderDark : v.bg },
        v.border && { borderWidth: 1.5, borderColor: v.border },
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <Text style={[styles.label, { color: disabled ? C.muted : v.text }]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56, borderRadius: 12, paddingHorizontal: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  label: {
    fontWeight: '700', fontSize: 16, letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
