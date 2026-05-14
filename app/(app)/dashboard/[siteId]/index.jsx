import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable, Alert, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../../../../src/context/AuthContext';
import { listLanes } from '../../../../src/api';
import ScreenHeader from '../../../../src/components/ScreenHeader';
import StatusBadge from '../../../../src/components/StatusBadge';
import { C } from '../../../../src/theme';

function ProgressBar({ value, total }) {
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  const complete = pct >= 1;
  return (
    <View style={styles.progWrap}>
      <View style={[styles.progBar, {
        width: `${Math.round(pct * 100)}%`,
        backgroundColor: complete ? C.green : '#F2A900',
      }]} />
    </View>
  );
}

export default function SiteDetailScreen() {
  const { siteId, siteName, siteDesc } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();

  const [lanes, setLanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await listLanes(siteId, token);
          if (active) {
            const list = Array.isArray(res) ? res : (res?.lanes || res?.data || []);
            setLanes(list);
          }
        } catch (err) {
          if (active) setError(err.message);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, [siteId, token]),
  );

  const totalSensors = lanes.reduce((sum, l) => sum + (l.device_count || 0), 0);
  const totalHealthy = lanes.reduce((sum, l) => sum + (l.healthy_count || 0), 0);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={siteName}
        subtitle={siteDesc}
        right={
          <Pressable style={styles.editBtn}
            onPress={() => router.push({
              pathname: '/(app)/dashboard/[siteId]/edit',
              params: { siteId, siteName, siteDesc },
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
          data={lanes}
          keyExtractor={(item) => String(item.lane_id || item.id || item.lane_name)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              {/* Stats card */}
              <View style={styles.statsCard}>
                {[
                  { label: 'Lanes', value: lanes.length, color: C.navy },
                  { label: 'Sensors', value: totalSensors, color: C.cyan },
                  { label: 'Healthy', value: totalHealthy, color: C.green },
                ].map((s) => (
                  <View key={s.label} style={styles.stat}>
                    <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
                    <Text style={styles.statLbl}>{s.label}</Text>
                  </View>
                ))}
              </View>

              {/* Register sensor CTA */}
              <Pressable
                style={({ pressed }) => [styles.registerBtn, pressed && { opacity: 0.85 }]}
                onPress={() => router.push({
                  pathname: '/(app)/register',
                  params: { siteId, siteName },
                })}
              >
                <Text style={styles.registerBtnText}>＋ Register Sensor</Text>
              </Pressable>

              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Lanes (DC Lines)</Text>
                <Pressable onPress={() => router.push({
                  pathname: '/(app)/dashboard/[siteId]/new-lane',
                  params: { siteId, siteName },
                })}>
                  <Text style={styles.addLink}>+ Add Lane</Text>
                </Pressable>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No lanes yet</Text>
              <Text style={styles.emptyBody}>Add the first DC line to start commissioning.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const registered = item.device_count || 0;
            const expected = item.expected_sensors || 8;
            const pct = expected > 0 ? Math.round((registered / expected) * 100) : 0;
            const complete = registered >= expected;
            return (
              <Pressable
                style={({ pressed }) => [styles.laneCard, pressed && { opacity: 0.85 }]}
                onPress={() => router.push({
                  pathname: '/(app)/dashboard/[siteId]/[laneId]',
                  params: {
                    siteId, siteName,
                    laneId: item.lane_id || item.id,
                    laneName: item.lane_name || item.name,
                  },
                })}
              >
                <View style={[styles.laneAvatar, {
                  backgroundColor: complete ? C.successBg : C.warningBg,
                }]}>
                  <Text style={[styles.laneAvatarText, { color: complete ? C.success : C.warning }]}>
                    {(item.lane_name || 'L').replace(/[^A-Z0-9]/gi, '').slice(-3).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.laneInfo}>
                  <Text style={styles.laneName}>{item.lane_name || item.name}</Text>
                  <Text style={styles.laneCount}>
                    <Text style={styles.laneCountBold}>{registered}</Text>
                    {' / '}{expected} sensors
                  </Text>
                </View>
                <View style={styles.laneProgress}>
                  <Text style={[styles.lanePct, { color: complete ? C.green : '#8A5A00' }]}>
                    {pct}%
                  </Text>
                  <ProgressBar value={registered} total={expected} />
                </View>
              </Pressable>
            );
          }}
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
    padding: 16, flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 12,
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
    color: '#fff', fontWeight: '700', fontSize: 15,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '700', fontSize: 13, color: C.muted,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  addLink: {
    fontWeight: '700', fontSize: 13, color: C.cyan,
    letterSpacing: 0.3, textTransform: 'uppercase',
  },
  empty: {
    padding: 32, alignItems: 'center',
    borderWidth: 1.5, borderColor: C.borderDark, borderStyle: 'dashed',
    borderRadius: 12, backgroundColor: C.white,
  },
  emptyTitle: { fontWeight: '700', fontSize: 17, color: C.navy },
  emptyBody: { fontSize: 14, color: C.muted, marginTop: 6, textAlign: 'center' },

  laneCard: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  laneAvatar: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  laneAvatarText: { fontWeight: '800', fontSize: 13 },
  laneInfo: { flex: 1 },
  laneName: { fontWeight: '700', fontSize: 16, color: C.navy },
  laneCount: { fontSize: 13, color: C.muted, marginTop: 2 },
  laneCountBold: { fontWeight: '700', color: C.navy },
  laneProgress: { width: 56, alignItems: 'flex-end', gap: 4 },
  lanePct: { fontWeight: '700', fontSize: 13 },
  progWrap: { height: 4, width: 56, backgroundColor: C.border, borderRadius: 100, overflow: 'hidden' },
  progBar: { height: '100%', borderRadius: 100 },
});
