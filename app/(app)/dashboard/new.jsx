import React, { useState } from 'react';
import {
  View, Text, ScrollView, Alert, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/context/AuthContext';
import { createSite } from '../../../src/api';
import ScreenHeader from '../../../src/components/ScreenHeader';
import Input from '../../../src/components/Input';
import Button from '../../../src/components/Button';
import QRScannerModal from '../../../src/components/QRScannerModal';
import { C } from '../../../src/theme';

export default function NewSiteScreen() {
  const router = useRouter();
  const { token, userEmail } = useAuth();
  const [siteName, setSiteName] = useState('');
  const [description, setDescription] = useState('');
  const [gatewayId, setGatewayId] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!siteName.trim() || !gatewayId) return;
    setLoading(true);
    try {
      await createSite({
        site_name: siteName.trim(),
        description: description.trim(),
        gateway_id: gatewayId,
        user: userEmail,
      }, token);
      router.back();
    } catch (err) {
      Alert.alert('Create Site Failed', err.message || 'Could not create site. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="New Site" subtitle="Step 1 of 2" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Input label="Site Name" value={siteName} onChangeText={setSiteName}
          placeholder="e.g. Maryborough Solar Farm" autoFocus
          hint="Use the official site name from the commissioning brief." />
        <Input label="Description (optional)" value={description} onChangeText={setDescription}
          placeholder="QLD — 120 MW · Block 3" />

        <View style={styles.gwSection}>
          <Text style={styles.sectionLabel}>Gateway Pairing</Text>
          <Button
            variant={gatewayId ? 'success' : 'primary'}
            onPress={() => setShowQR(true)}
          >
            {gatewayId ? `✓ ${gatewayId}` : 'Scan Gateway QR Code'}
          </Button>
          <Text style={styles.hint}>
            Locate the QR sticker on the LoRa gateway enclosure.
          </Text>
        </View>

        <View style={{ flex: 1, minHeight: 24 }} />
        <Button onPress={handleCreate} loading={loading}
          disabled={!siteName.trim() || !gatewayId}>
          Create Site
        </Button>
      </ScrollView>

      <QRScannerModal
        visible={showQR}
        onClose={() => setShowQR(false)}
        onScanned={(data) => setGatewayId(data)}
        title="Scan Gateway QR Code"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 24, gap: 18 },
  gwSection: { gap: 10 },
  sectionLabel: {
    fontWeight: '600', fontSize: 12, color: C.muted,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  hint: { fontSize: 13, color: C.muted },
});
