import React, { useState } from 'react';
import {
  View, Text, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { verifyEmail } from '../../src/api';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import { C } from '../../src/theme';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      await verifyEmail(email, code.trim());
      Alert.alert('Verified!', 'Your account is active. Sign in to continue.', [
        { text: 'Sign In', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (err) {
      Alert.alert('Verification Failed', err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.icon}>
          <Text style={{ fontSize: 40 }}>✉️</Text>
        </View>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.body}>
          We sent a verification code to{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        <View style={styles.form}>
          <Input
            label="Verification Code"
            value={code}
            onChangeText={setCode}
            placeholder="Enter 6-digit code"
            keyboardType="number-pad"
            autoFocus
          />
          <Button onPress={handleVerify} loading={loading} disabled={!code.trim()}>
            Verify Account
          </Button>
          <Button variant="ghost" onPress={() => router.back()}>
            Back to Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 28, alignItems: 'center' },
  icon: {
    width: 80, height: 80, borderRadius: 20, backgroundColor: C.infoBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  title: { fontWeight: '800', fontSize: 26, color: C.navy, marginBottom: 12 },
  body: { fontSize: 15, color: C.muted, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  emailText: { fontWeight: '700', color: C.navy },
  form: { width: '100%', gap: 16 },
});
