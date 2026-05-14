import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Alert, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { loginUser, registerUser } from '../../src/api';
import Logo from '../../src/components/Logo';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import { C } from '../../src/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      const res = await loginUser(email.trim().toLowerCase(), password);
      const token = res?.token || res?.accessToken || res?.id_token || res?.AuthenticationResult?.IdToken;
      if (!token) throw new Error('No token returned from server');
      await signIn(token, email.trim().toLowerCase());
      router.replace('/(app)/dashboard');
    } catch (err) {
      Alert.alert('Sign In Failed', err.message || 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password || !name.trim()) {
      Alert.alert('Missing Fields', 'Please fill in your name, email, and password.');
      return;
    }
    setLoading(true);
    try {
      await registerUser({ email: email.trim().toLowerCase(), password, name: name.trim() });
      router.push({ pathname: '/(auth)/verify', params: { email: email.trim().toLowerCase() } });
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'Could not create account. Please try again.');
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
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand header */}
        <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
          <Logo size={64} />
          <Text style={styles.tagline}>
            Solar string commissioning &amp; monitoring{'\n'}for field technicians
          </Text>
        </View>

        {/* Mode toggle */}
        <View style={styles.toggle}>
          {['login', 'register'].map((m) => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              style={[styles.toggleBtn, mode === m && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleLabel, mode === m && styles.toggleLabelActive]}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'register' && (
            <Input label="Full Name" value={name} onChangeText={setName}
              placeholder="Jordan Chen" autoCapitalize="words" />
          )}
          <Input label="Email" value={email} onChangeText={setEmail}
            placeholder="tech@poweramigo.com.au" keyboardType="email-address" />
          <Input label="Password" value={password} onChangeText={setPassword}
            placeholder="••••••••" secureTextEntry />

          {mode === 'login' && (
            <Pressable style={{ alignSelf: 'flex-end' }}>
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </Pressable>
          )}

          <View style={{ height: 8 }} />

          <Button
            onPress={mode === 'login' ? handleLogin : handleRegister}
            loading={loading}
            disabled={mode === 'login' ? !email || !password : !email || !password || !name}
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>

          <Text style={styles.version}>v3.2.1 · Secure field connection</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  header: {
    backgroundColor: '#F4FAFE', borderBottomWidth: 1, borderBottomColor: C.border,
    paddingHorizontal: 28, paddingBottom: 28, alignItems: 'center', gap: 20,
  },
  tagline: {
    fontSize: 14, fontWeight: '500', color: C.muted,
    textAlign: 'center', lineHeight: 20,
  },
  toggle: {
    flexDirection: 'row', margin: 24, marginBottom: 0,
    backgroundColor: C.bg, borderRadius: 12, padding: 4, gap: 4,
  },
  toggleBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 9, alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: C.white,
    shadowColor: C.navy, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  toggleLabel: {
    fontWeight: '700', fontSize: 13, color: C.muted,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  toggleLabelActive: { color: C.navy },
  form: { padding: 24, gap: 16, flex: 1 },
  forgotLink: {
    fontWeight: '600', fontSize: 14, color: C.cyan,
  },
  version: {
    textAlign: 'center', fontSize: 12, color: C.muted, letterSpacing: 0.5,
    marginTop: 8,
  },
});
