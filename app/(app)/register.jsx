import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Alert, StyleSheet, ActivityIndicator, Pressable,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import Svg, { Circle, Path } from 'react-native-svg';
import { useAuth } from '../../src/context/AuthContext';
import { listSites, listLanes, registerDevice, saveLocation } from '../../src/api';
import ScreenHeader from '../../src/components/ScreenHeader';
import Button from '../../src/components/Button';
import QRScannerModal from '../../src/components/QRScannerModal';
import StatusBadge from '../../src/components/StatusBadge';
import { C } from '../../src/theme';

function SelectField({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  return (
    <View style={styles.selectWrapper}>
      <Text style={styles.selectLabel}>{label}</Text>
      <Pressable style={styles.selectBox} onPress={() => setOpen(!open)}>
        <Text style={styles.selectValue} numberOfLines={1}>
          {selected?.label || 'Select…'}
        </Text>
        <Text style={{ color: C.muted }}>▾</Text>
      </Pressable>
      {open && (
        <View style={styles.dropdown}>
          {options.map((o) => (
            <Pressable
              key={o.value}
              style={[styles.dropItem, o.value === value && styles.dropItemActive]}
              onPress={() => { onChange(o.value); setOpen(false); }}
            >
              <Text style={[styles.dropItemText, o.value === value && styles.dropItemTextActive]}>
                {o.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function RegisterSensorScreen() {
  const { siteId: initSiteId, siteName: initSiteName, laneId: initLaneId } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [sites, setSites] = useState([]);
  const [lanes, setLanes] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(initSiteId || null);
  const [selectedLaneId, setSelectedLaneId] = useState(initLaneId || null);

  const [scannedMac, setScannedMac] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const [gpsState, setGpsState] = useState('idle'); // idle | requesting | done | error
  const [coords, setCoords] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingSites, setLoadingSites] = useState(true);

  // Load sites on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await listSites(null, token);
        const list = Array.isArray(res) ? res : (res?.sites || res?.data || []);
        setSites(list);
        if (!selectedSiteId && list[0]) setSelectedSiteId(list[0].site_id || list[0].id);
      } catch (err) {
        Alert.alert('Error', 'Could not load sites: ' + err.message);
      } finally {
        setLoadingSites(false);
      }
    })();
  }, []);

  // Load lanes when site changes
  useEffect(() => {
    if (!selectedSiteId) return;
    setLanes([]);
    setSelectedLaneId(null);
    (async () => {
      try {
        const res = await listLanes(selectedSiteId, token);
        const list = Array.isArray(res) ? res : (res?.lanes || res?.data || []);
        setLanes(list);
        if (initLaneId) {
          setSelectedLaneId(initLaneId);
        } else if (list[0]) {
          setSelectedLaneId(list[0].lane_id || list[0].id);
        }
      } catch (err) {
        // lanes might just be empty
      }
    })();
  }, [selectedSiteId]);

  // Auto-acquire GPS on mount
  useEffect(() => {
    acquireGps();
  }, []);

  const acquireGps = async () => {
    setGpsState('requesting');
    setCoords(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsState('error');
        Alert.alert('Location Access Denied', 'GPS coordinates are required to register a sensor. Please enable location access in Settings.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setCoords({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        accuracy: Math.round(loc.coords.accuracy),
      });
      setGpsState('done');
    } catch (err) {
      setGpsState('error');
      Alert.alert('GPS Error', 'Could not get location: ' + err.message);
    }
  };

  const handleConfirm = async () => {
    if (!scannedMac || !selectedSiteId || !selectedLaneId || !coords) return;
    setLoading(true);
    const timestamp = new Date().toISOString();
    try {
      await Promise.all([
        registerDevice({
          mac: scannedMac,
          site_id: selectedSiteId,
          lane_id: selectedLaneId,
          lat: coords.lat,
          lng: coords.lng,
        }, token),
        saveLocation({ mac: scannedMac, lat: coords.lat, lng: coords.lng, timestamp }, token),
      ]);

      Alert.alert(
        '✓ Sensor Registered',
        `MAC: ${scannedMac}\nGPS: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}\nUploaded at ${new Date().toLocaleTimeString()}`,
        [
          { text: 'Register Another', onPress: () => { setScannedMac(null); acquireGps(); } },
          { text: 'Done', onPress: () => router.back() },
        ],
      );
    } catch (err) {
      Alert.alert('Upload Failed', err.message || 'Could not register sensor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const siteOptions = sites.map((s) => ({ value: s.site_id || s.id, label: s.site_name || s.name }));
  const laneOptions = lanes.map((l) => ({ value: l.lane_id || l.id, label: l.lane_name || l.name }));

  const canConfirm = scannedMac && selectedSiteId && selectedLaneId && gpsState === 'done';

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Register Sensor" subtitle="QR · Location · Upload" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        {loadingSites ? (
          <ActivityIndicator color={C.cyan} style={{ marginVertical: 20 }} />
        ) : (
          <>
            <SelectField
              label="Site"
              value={selectedSiteId}
              options={siteOptions}
              onChange={(v) => setSelectedSiteId(v)}
            />
            <SelectField
              label="Lane"
              value={selectedLaneId}
              options={laneOptions.length ? laneOptions : [{ value: '', label: 'No lanes — add one first' }]}
              onChange={(v) => setSelectedLaneId(v)}
            />
          </>
        )}

        {/* QR Scanner section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sensor QR Code</Text>
          <Pressable
            style={({ pressed }) => [styles.qrButton, pressed && { opacity: 0.85 },
              scannedMac && styles.qrButtonSuccess]}
            onPress={() => setShowQR(true)}
          >
            {scannedMac ? (
              <View style={styles.qrContent}>
                <Text style={styles.qrSuccessIcon}>✓</Text>
                <Text style={styles.qrSuccessText} numberOfLines={1}>{scannedMac}</Text>
              </View>
            ) : (
              <View style={styles.qrContent}>
                <View style={styles.qrIcon} />
                <Text style={styles.qrLabel}>Tap to Scan Sensor QR Code</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* GPS card */}
        <View style={styles.gpsCard}>
          <View style={[styles.gpsIcon, {
            backgroundColor: gpsState === 'done' ? C.successBg : C.infoBg,
          }]}>
            {gpsState === 'requesting' ? (
              <ActivityIndicator color={C.cyan} />
            ) : (
              <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
                <Circle cx="11" cy="9" r="3"
                  stroke={gpsState === 'done' ? C.green : C.cyan} strokeWidth="2" />
                <Path
                  d="M11 1.5a7.5 7.5 0 00-7.5 7.5c0 5 7.5 11.5 7.5 11.5s7.5-6.5 7.5-11.5A7.5 7.5 0 0011 1.5z"
                  stroke={gpsState === 'done' ? C.green : C.cyan} strokeWidth="2"
                />
              </Svg>
            )}
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.gpsTitle}>
              {gpsState === 'requesting' ? 'Acquiring GPS…'
                : gpsState === 'done' ? 'Location Locked'
                : gpsState === 'error' ? 'GPS Unavailable'
                : 'GPS Ready'}
            </Text>
            {coords ? (
              <Text style={styles.gpsCoords}>
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                {'  '}
                <Text style={{ color: C.muted }}>±{coords.accuracy}m</Text>
              </Text>
            ) : (
              <Text style={styles.gpsHint}>
                {gpsState === 'error' ? 'Tap Re-acquire to retry' : 'Hold device level. Sky view recommended.'}
              </Text>
            )}
          </View>
          {gpsState === 'done' && <StatusBadge tone="online">Fix</StatusBadge>}
          {(gpsState === 'error' || gpsState === 'idle') && (
            <Pressable style={styles.reacquireBtn} onPress={acquireGps}>
              <Text style={styles.reacquireText}>Retry</Text>
            </Pressable>
          )}
        </View>

        <View style={{ flex: 1, minHeight: 16 }} />
        <Button
          variant="success"
          onPress={handleConfirm}
          loading={loading}
          disabled={!canConfirm}
        >
          Confirm &amp; Upload
        </Button>
      </ScrollView>

      <QRScannerModal
        visible={showQR}
        onClose={() => setShowQR(false)}
        onScanned={(data) => setScannedMac(data)}
        title="Scan Sensor QR Code"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 24, gap: 16 },
  section: { gap: 8 },
  sectionLabel: {
    fontWeight: '600', fontSize: 12, color: C.muted,
    letterSpacing: 1, textTransform: 'uppercase',
  },

  selectWrapper: { gap: 6, zIndex: 1 },
  selectLabel: {
    fontWeight: '600', fontSize: 12, color: C.muted,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  selectBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.borderDark,
    borderRadius: 10, paddingHorizontal: 14, height: 52,
  },
  selectValue: { fontWeight: '600', fontSize: 17, color: C.navy, flex: 1 },
  dropdown: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.borderDark,
    borderRadius: 10, marginTop: 2, overflow: 'hidden',
    shadowColor: C.navy, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4,
  },
  dropItem: { paddingVertical: 14, paddingHorizontal: 14 },
  dropItemActive: { backgroundColor: C.infoBg },
  dropItemText: { fontSize: 16, color: C.navy },
  dropItemTextActive: { fontWeight: '700', color: C.cyan },

  qrButton: {
    height: 80, borderRadius: 14, backgroundColor: C.navy,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  qrButtonSuccess: { backgroundColor: C.green },
  qrContent: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20 },
  qrIcon: {
    width: 32, height: 32, borderWidth: 2.5, borderColor: '#fff',
    borderRadius: 4, opacity: 0.7,
  },
  qrLabel: {
    fontWeight: '700', fontSize: 15, color: '#fff',
    letterSpacing: 0.4, textTransform: 'uppercase',
  },
  qrSuccessIcon: { fontSize: 24, color: '#fff' },
  qrSuccessText: {
    fontFamily: 'monospace', fontWeight: '600', fontSize: 14, color: '#fff',
    flex: 1,
  },

  gpsCard: {
    backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.borderDark,
    borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  gpsIcon: {
    width: 42, height: 42, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  gpsTitle: {
    fontWeight: '700', fontSize: 14, color: C.navy,
    letterSpacing: 0.4, textTransform: 'uppercase',
  },
  gpsCoords: {
    fontFamily: 'monospace', fontWeight: '600', fontSize: 14, color: C.navy, marginTop: 4,
  },
  gpsHint: { fontSize: 13, color: C.muted, marginTop: 4 },
  reacquireBtn: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.borderDark,
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8,
  },
  reacquireText: { fontWeight: '700', fontSize: 12, color: C.navy },
});
