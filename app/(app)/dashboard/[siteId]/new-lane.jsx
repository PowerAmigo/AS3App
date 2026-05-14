import React, { useState } from 'react';
import {
  View, Text, ScrollView, Alert, StyleSheet, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../../src/context/AuthContext';
import { createLane } from '../../../../src/api';
import ScreenHeader from '../../../../src/components/ScreenHeader';
import Input from '../../../../src/components/Input';
import Button from '../../../../src/components/Button';
import { C } from '../../../../src/theme';

const QUICK_LABELS = ['Row 01', 'Row 02', 'Row 03', 'Row 04', 'Block A1', 'Block A2'];

export default function NewLaneScreen() {
  const { siteId, siteName } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();
  const [laneName, setLaneName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!laneName.trim()) return;
    setLoading(true);
    try {
      await createLane({ site_id: siteId, lane_name: laneName.trim() }, token);
      router.back();
    } catch (err) {
      Alert.alert('Create Lane Failed', err.message || 'Could not create lane.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="New Lane" subtitle={siteName} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Input
          label="Lane Name / Label"
          value={laneName}
          onChangeText={setLaneName}
          placeholder="e.g. Row 12-A"
          autoFocus
          hint="Use the field-painted label visible on the combiner box."
        />

        <View style={styles.quickSection}>
          <Text style={styles.quickLabel}>Quick Labels</Text>
          <View style={styles.quickChips}>
            {QUICK_LABELS.map((l) => (
              <Pressable
                key={l}
                onPress={() => setLaneName(l)}
                style={({ pressed }) => [styles.chip, pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.chipText}>{l}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ flex: 1, minHeight: 24 }} />
        <Button onPress={handleCreate} loading={loading} disabled={!laneName.trim()}>
          Save Lane
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 24, gap: 18 },
  quickSection: { gap: 10 },
  quickLabel: {
    fontWeight: '600', fontSize: 12, color: C.muted,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  quickChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 100,
    borderWidth: 1.5, borderColor: C.borderDark, backgroundColor: C.white,
  },
  chipText: { fontWeight: '600', fontSize: 13, color: C.navy },
});
