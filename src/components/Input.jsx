import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { C } from '../theme';

export default function Input({
  label, value, onChangeText, placeholder, hint,
  secureTextEntry, keyboardType, autoCapitalize = 'none',
  autoFocus, editable = true, prefix,
}) {
  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
      <View style={[styles.box, !editable && styles.disabled]}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.borderDark}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
          editable={editable}
          autoCorrect={false}
        />
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    fontWeight: '600', fontSize: 12, color: C.muted,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  box: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.borderDark,
    borderRadius: 10, paddingHorizontal: 14, height: 52,
  },
  disabled: { opacity: 0.6 },
  prefix: { fontWeight: '600', color: C.muted, marginRight: 8 },
  input: {
    flex: 1, fontWeight: '500', fontSize: 17, color: C.navy,
    height: '100%',
  },
  hint: { fontSize: 13, color: C.muted },
});
