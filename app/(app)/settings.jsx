import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Alert, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { updatePassword } from '../../src/api';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';
import { C } from '../../src/theme';

function SettingRow({ label, value, last }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function ToggleRow({ label, value, last }) {
  const [on, setOn] = useState(value);
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Pressable
        style={[styles.toggle, on && styles.toggleOn]}
        onPress={() => setOn(!on)}
      >
        <View style={[styles.toggleThumb, on && styles.toggleThumbOn]} />
      </Pressable>
    </View>
  );
}

export default function SettingsScreen() {
  const { token, userEmail, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const [showPwForm, setShowPwForm] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPw || !newPw || !confirmPw) {
      Alert.alert('Missing Fields', 'Please fill in all password fields.');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('Password Mismatch', 'New password and confirmation do not match.');
      return;
    }
    if (newPw.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(userEmail, oldPw, newPw, token);
      Alert.alert('Password Updated', 'Your password has been changed successfully.', [
        { text: 'OK', onPress: () => { setShowPwForm(false); setOldPw(''); setNewPw(''); setConfirmPw(''); } },
      ]);
    } catch (err) {
      Alert.alert('Update Failed', err.message || 'Could not update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSub}>v3.2.1 · Power Amigo Field App</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}>
        {/* Account */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.group}>
          <SettingRow label="Email" value={userEmail || '—'} />
          <SettingRow label="Role" value="Field Technician" last />
        </View>

        {/* Field Mode */}
        <Text style={styles.sectionLabel}>Field Mode</Text>
        <View style={styles.group}>
          <ToggleRow label="Offline Queue" value={true} />
          <ToggleRow label="Haptic Feedback" value={true} last />
        </View>

        {/* Data & Sync */}
        <Text style={styles.sectionLabel}>Data &amp; Sync</Text>
        <View style={styles.group}>
          <SettingRow label="Server Region" value="AWS ap-southeast-2" />
          <SettingRow label="Environment" value="dev" last />
        </View>

        {/* Change password */}
        <Text style={styles.sectionLabel}>Security</Text>
        <View style={styles.group}>
          <Pressable
            style={[styles.row]}
            onPress={() => setShowPwForm(!showPwForm)}
          >
            <Text style={styles.rowLabel}>Change Password</Text>
            <Text style={styles.chevron}>{showPwForm ? '▴' : '▾'}</Text>
          </Pressable>
          {showPwForm && (
            <View style={styles.pwForm}>
              <Input label="Current Password" value={oldPw} onChangeText={setOldPw}
                secureTextEntry placeholder="Current password" />
              <Input label="New Password" value={newPw} onChangeText={setNewPw}
                secureTextEntry placeholder="At least 8 characters" />
              <Input label="Confirm New Password" value={confirmPw} onChangeText={setConfirmPw}
                secureTextEntry placeholder="Repeat new password" />
              <Button onPress={handleChangePassword} loading={loading}>
                Update Password
              </Button>
            </View>
          )}
        </View>

        {/* Logout */}
        <View style={{ marginTop: 8 }}>
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: C.white, paddingHorizontal: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerTitle: { fontWeight: '700', fontSize: 28, color: C.navy },
  headerSub: { fontWeight: '500', fontSize: 13, color: C.muted, marginTop: 2 },

  scroll: { padding: 16, gap: 4 },
  sectionLabel: {
    fontWeight: '700', fontSize: 12, color: C.muted,
    letterSpacing: 1, textTransform: 'uppercase',
    paddingHorizontal: 4, marginTop: 16, marginBottom: 8,
  },
  group: {
    backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: C.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16, minHeight: 52,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F4F7' },
  rowLabel: { flex: 1, fontWeight: '600', fontSize: 15, color: C.navy },
  rowValue: { fontSize: 14, color: C.muted },
  chevron: { fontSize: 12, color: C.muted },

  toggle: {
    width: 44, height: 26, borderRadius: 100,
    backgroundColor: C.borderDark, padding: 3,
    justifyContent: 'flex-start',
  },
  toggleOn: { backgroundColor: C.green },
  toggleThumb: {
    width: 20, height: 20, borderRadius: 100, backgroundColor: C.white,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
  },
  toggleThumbOn: { transform: [{ translateX: 18 }] },

  pwForm: {
    padding: 16, gap: 12,
    borderTopWidth: 1, borderTopColor: C.border,
  },

  logoutBtn: {
    borderWidth: 1.5, borderColor: C.errorBg, borderRadius: 12,
    backgroundColor: C.white, paddingVertical: 14, alignItems: 'center',
  },
  logoutText: {
    fontWeight: '700', fontSize: 14, color: C.error,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
});
