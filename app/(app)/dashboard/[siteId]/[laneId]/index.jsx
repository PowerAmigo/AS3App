import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable, Alert, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../../../../../src/context/AuthContext';
import { listDevices, deleteDevice } from '../../../../../src/api';
import ScreenHeader from '../../../../../src/components/ScreenHeader';
import StatusBadge from '../../../../../src/components/StatusBadge';
import { C } from '../../../../../src/theme';

export default function LaneDetailScreen() {
  const { siteId, siteName, laneId, laneName } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await listDevices({ site_id: siteId, lane_id: laneId }, token);
          if (active) {
            const list = Array.isArray(res) ? res : (res?.devices || res?.data || []);
            setDevices(list);
          }
        } catch (err) {
          if (active) setError(err.message);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, [siteId, laneId, token]),
  );

  const handleDeleteDevice = (device) => {
    Alert.alert(
      'Delete Sensor',
      `Delete sensor ${device.mac || device.device_id}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            try {
              await deleteDevice(device.mac || device.device_id, token);
              setDevices((prev) => prev.filter((d) => d.mac !== device.mac));
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ],
    );
  };

  const healthy = devices.filter((d) => d.status === 'online').length;
  const faults = devices.filter((d) => d.status === 'fault').length;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={laneName}
        subtitle={siteName}
        right={
          <Pressable style={styles.editBtn}
            onPress={() => router.push({
              pathname: '/(app)/dashboard/[siteId]/[laneId]/edit',
              params: { siteId, siteName, laneId, laneName },
            })}>
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path d="M11 1.5l3.5 3.5L5 14.5H1.5V11L11 1.5z"
                stroke={C.navy} strokeWidth="1.6" strokeLinejoin="round" />
            </Svg>
          </Pressable>
        }
      />

      {loading ? (
        <View style={styles.centered}><ActivityIndicator color={C.cyan} size="large" /></View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item, i) => String(item.mac || item.device_id || i)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              {/* Lane stats */}
              <View style={styles.statsCard}>
                {[
                  { label: 'Registered', value: devices.length, color: C.navy },
                  { label: 'Healthy', value: healthy, color: C.green },
                  { label: 'Issues', value: faults, color: C.error },
                ].map((s) => (
                  <View key={s.label} style={styles.stat}>
                    <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
                    <Text style={styles.statLbl}>{s.label}</Text>
                  </View>
                ))}
              </View>

              {/* Register sensor on this lane */}
              <Pressable
                style={({ pressed }) => [styles.registerBtn, pressed && { opacity: 0.85 }]}
                onPress={() => router.push({
                  pathname: '/(app)/register',
                  params: { siteId, siteName, laneId, laneName },
                })}
              >
                <Text style={styles.registerBtnText}>＋ Register Sensor on this Lane</Text>
              </Pressable>

              <Text style={styles.sectionTitle}>Sensors</Text>
            </>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No sensors yet</Text>
              <Text style={styles.emptyBody}>Scan the first sensor QR to start commissioning.</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <Pressable
              style={({ pressed }) => [styles.deviceCard, pressed && { opacity: 0.85 }]}
              onLongPress={() => handleDeleteDevice(item)}
            >
              <View style={[styles.deviceNum, {
                backgroundColor: item.status === 'online' ? C.successBg
                  : item.status === 'fault' ? C.errorBg : C.warningBg,
              }]}>
                <Text style={[styles.deviceNumText, {
                  color: item.status === 'online' ? C.success
                    : item.status === 'fault' ? C.error : C.warning,
                }]}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceMac}>{item.mac || item.device_id}</Text>
                {(item.lat && item.lng) ? (
                  <Text style={styles.deviceCoords}>
                    {Number(item.lat).toFixed(4)}, {Number(item.lng).toFixed(4)}
                  </Text>
                ) : null}
              </View>
              <StatusBadge tone={
                item.status === 'online' ? 'online'
                  : item.status === 'fault' ? 'error' : 'pending'
              }>
                {item.status || 'registered'}
              </StatusBadge>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  editBtn: {
    width: 40, height: 40, borderRadius: 10, borderWidth: 1.5,
    borderColor: C.borderDark, backgroundColor: C.white,
    alignItems: 'center', justifyContent: 'center',
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 15, color: C.error, textAlign: 'center', padding: 20 },

  list: { padding: 16, gap: 10 },
  statsCard: {
    backgroundColor: C.white, borderRadius: 14, borderWidth: 1, borderColor: C.border,
    padding: 16, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12,
  },
  stat: { alignItems: 'center' },
  statVal: { fontWeight: '800', fontSize: 22 },
  statLbl: {
    fontWeight: '600', fontSize: 11, color: C.muted,
    letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 4,
  },
  registerBtn: {
    backgroundColor: C.green, borderRadius: 12, padding: 14,
    alignItems: 'center', marginBottom: 16,
    shadowColor: C.green, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  registerBtnText: {
    color: '#fff', fontWeight: '700', fontSize: 14,
    letterSpacing: 0.4, textTransform: 'uppercase',
  },
  sectionTitle: {
    fontWeight: '700', fontSize: 13, color: C.muted,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4,
  },
  empty: {
    padding: 32, alignItems: 'center',
    borderWidth: 1.5, borderColor: C.borderDark, borderStyle: 'dashed',
    borderRadius: 12, backgroundColor: C.white,
  },
  emptyTitle: { fontWeight: '700', fontSize: 17, color: C.navy },
  emptyBody: { fontSize: 14, color: C.muted, marginTop: 6, textAlign: 'center' },

  deviceCard: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, padding: 14, flexDirection: 'row',
    alignItems: 'center', gap: 12,
  },
  deviceNum: {
    width: 36, height: 36, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  deviceNumText: { fontWeight: '800', fontSize: 13 },
  deviceInfo: { flex: 1, minWidth: 0 },
  deviceMac: {
    fontFamily: 'monospace', fontWeight: '600', fontSize: 13, color: C.navy,
  },
  deviceCoords: {
    fontFamily: 'monospace', fontSize: 11.5, color: C.muted, marginTop: 3,
  },
});
