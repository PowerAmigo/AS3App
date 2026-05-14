import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Pressable, Alert, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import Svg, { Path, Rect } from 'react-native-svg';
import { useAuth } from '../../../src/context/AuthContext';
import { listSites } from '../../../src/api';
import StatusBadge from '../../../src/components/StatusBadge';
import { C } from '../../../src/theme';

function SolarIcon({ color = C.cyan }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="12" rx="1.5" stroke={color} strokeWidth="1.8" />
      <Path d="M3 10h18M3 14h18M9 6v12M15 6v12" stroke={color} strokeWidth="1.4" />
    </Svg>
  );
}

function ChevronRight() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path d="M7 4l6 6-6 6" stroke={C.borderDark} strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function DashboardScreen() {
  const { token, userEmail, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await listSites(userEmail, token);
          if (active) {
            const list = Array.isArray(res) ? res : (res?.sites || res?.data || []);
            setSites(list);
          }
        } catch (err) {
          if (active) setError(err.message);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, [token, userEmail]),
  );

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const totalSensors = sites.reduce((sum, s) => sum + (s.device_count || s.sensor_count || 0), 0);
  const totalAlerts = sites.reduce((sum, s) => sum + (s.alert_count || 0), 0);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Sites</Text>
          <Text style={styles.headerSub}>{sites.length} registered · {userEmail}</Text>
        </View>
        <Pressable onPress={handleLogout} style={styles.avatarBtn}>
          <Text style={styles.avatarText}>{(userEmail?.[0] || 'U').toUpperCase()}</Text>
        </Pressable>
      </View>

      {/* Stats bar */}
      <View style={styles.statsRow}>
        {[
          { label: 'Sites', value: sites.length, color: C.navy },
          { label: 'Sensors', value: totalSensors, color: C.cyan },
          { label: 'Alerts', value: totalAlerts, color: C.error },
        ].map((s) => (
          <View key={s.label} style={styles.statCell}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={C.cyan} size="large" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => useFocusEffect} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={sites}
          keyExtractor={(item) => String(item.site_id || item.id || item.site_name)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Sites</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No sites yet</Text>
              <Text style={styles.emptyBody}>Tap + to register your first solar farm site.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
              onPress={() => router.push({
                pathname: '/(app)/dashboard/[siteId]',
                params: {
                  siteId: item.site_id || item.id,
                  siteName: item.site_name || item.name,
                  siteDesc: item.description || '',
                },
              })}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardIcon}>
                  <SolarIcon />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{item.site_name || item.name}</Text>
                  <Text style={styles.cardDesc}>{item.description || ''}</Text>
                </View>
                <StatusBadge tone={item.status === 'online' ? 'online' : 'pending'}>
                  {item.status || 'active'}
                </StatusBadge>
              </View>
              <View style={styles.cardStats}>
                <View style={styles.miniStat}>
                  <Text style={styles.miniValue}>{item.lane_count || item.lanes || 0}</Text>
                  <Text style={styles.miniLabel}>Lanes</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.miniStat}>
                  <Text style={styles.miniValue}>{item.device_count || item.sensors || 0}</Text>
                  <Text style={styles.miniLabel}>Sensors</Text>
                </View>
                <View style={{ flex: 1 }} />
                <ChevronRight />
              </View>
            </Pressable>
          )}
        />
      )}

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        onPress={() => router.push('/(app)/dashboard/new')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: {
    backgroundColor: C.white, paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontWeight: '700', fontSize: 28, color: C.navy },
  headerSub: { fontWeight: '500', fontSize: 13, color: C.muted, marginTop: 2 },
  avatarBtn: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: C.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontWeight: '700', fontSize: 16, color: C.navy },

  statsRow: {
    flexDirection: 'row', backgroundColor: C.white,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  statCell: {
    flex: 1, paddingVertical: 14, alignItems: 'center',
    borderRightWidth: 1, borderRightColor: C.border,
  },
  statValue: { fontWeight: '800', fontSize: 26, lineHeight: 30 },
  statLabel: {
    fontWeight: '600', fontSize: 11, color: C.muted,
    letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 4,
  },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { fontSize: 15, color: C.error, textAlign: 'center', marginBottom: 16 },
  retryBtn: {
    backgroundColor: C.cyan, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10,
  },
  retryText: { color: '#fff', fontWeight: '700' },

  list: { padding: 16, gap: 10 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionTitle: {
    fontWeight: '700', fontSize: 13, color: C.muted,
    letterSpacing: 1, textTransform: 'uppercase',
  },
  empty: {
    padding: 32, alignItems: 'center',
    borderWidth: 1.5, borderColor: C.borderDark, borderStyle: 'dashed',
    borderRadius: 14, backgroundColor: C.white, marginTop: 8,
  },
  emptyTitle: { fontWeight: '700', fontSize: 17, color: C.navy },
  emptyBody: { fontSize: 14, color: C.muted, marginTop: 6, textAlign: 'center' },

  card: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 14, padding: 16, gap: 12,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  cardIcon: {
    width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E0F6FE',
  },
  cardInfo: { flex: 1, minWidth: 0 },
  cardName: { fontWeight: '700', fontSize: 17, color: C.navy, marginBottom: 3 },
  cardDesc: { fontSize: 13, color: C.muted },
  cardStats: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border,
    borderStyle: 'dashed',
  },
  miniStat: { gap: 2 },
  miniValue: { fontWeight: '700', fontSize: 18, color: C.navy },
  miniLabel: {
    fontWeight: '600', fontSize: 11, color: C.muted,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  divider: { width: 1, height: 32, backgroundColor: C.border },

  fab: {
    position: 'absolute', bottom: 24, right: 20,
    width: 60, height: 60, borderRadius: 16,
    backgroundColor: C.cyan, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.cyan, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabIcon: { color: '#fff', fontSize: 30, fontWeight: '300', lineHeight: 34, marginTop: -2 },
});
