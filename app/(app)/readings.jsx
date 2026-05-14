import React, { useState } from 'react';
import {
  View, Text, FlatList, Pressable, Alert, StyleSheet, ActivityIndicator,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { getReadingsPaginated } from '../../src/api';
import { C } from '../../src/theme';

export default function ReadingsScreen() {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();

  const [mac, setMac] = useState('');
  const [readings, setReadings] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [searched, setSearched] = useState(false);

  const loadReadings = async (targetMac, targetPage = 1) => {
    if (!targetMac.trim()) {
      Alert.alert('Enter MAC', 'Please enter a sensor MAC address to search readings.');
      return;
    }
    setLoading(true);
    if (targetPage === 1) setReadings([]);
    try {
      const res = await getReadingsPaginated(targetMac.trim(), targetPage, 20, token);
      const list = Array.isArray(res) ? res : (res?.readings || res?.data || res?.items || []);
      if (targetPage === 1) {
        setReadings(list);
      } else {
        setReadings((prev) => [...prev, ...list]);
      }
      setPage(targetPage);
      setHasMore(list.length === 20);
      setSearched(true);
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not load readings.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return isNaN(d) ? ts : d.toLocaleString('en-AU', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Readings</Text>
        <Text style={styles.headerSub}>Live sensor data</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={mac}
          onChangeText={setMac}
          placeholder="Enter sensor MAC address…"
          placeholderTextColor={C.muted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => loadReadings(mac)}
        />
        <Pressable
          style={({ pressed }) => [styles.searchBtn, pressed && { opacity: 0.85 }]}
          onPress={() => loadReadings(mac)}
        >
          <Text style={styles.searchBtnText}>Search</Text>
        </Pressable>
      </View>

      {loading && page === 1 ? (
        <View style={styles.centered}>
          <ActivityIndicator color={C.cyan} size="large" />
        </View>
      ) : (
        <FlatList
          data={readings}
          keyExtractor={(item, i) => String(item.reading_id || item.id || i)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            searched ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No readings found</Text>
                <Text style={styles.emptyBody}>No data for this sensor MAC address.</Text>
              </View>
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Search readings</Text>
                <Text style={styles.emptyBody}>Enter a sensor MAC address above to view its readings.</Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <View style={styles.readingCard}>
              <View style={styles.readingLeft}>
                <Text style={styles.readingMac}>{item.mac || mac}</Text>
                <Text style={styles.readingTime}>{formatTimestamp(item.timestamp)}</Text>
              </View>
              <View style={styles.readingRight}>
                <Text style={styles.readingValue}>
                  {item.current != null ? `${item.current} A` : item.voltage != null ? `${item.voltage} V` : '—'}
                </Text>
                {item.power != null && (
                  <Text style={styles.readingUnit}>{item.power} W</Text>
                )}
              </View>
            </View>
          )}
          onEndReached={() => {
            if (hasMore && !loading) loadReadings(mac, page + 1);
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loading && page > 1 ? <ActivityIndicator color={C.cyan} style={{ margin: 16 }} /> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: {
    backgroundColor: C.white, paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerTitle: { fontWeight: '700', fontSize: 28, color: C.navy },
  headerSub: { fontWeight: '500', fontSize: 13, color: C.muted, marginTop: 2 },

  searchRow: {
    flexDirection: 'row', gap: 10, padding: 16,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  searchInput: {
    flex: 1, backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.borderDark,
    borderRadius: 10, paddingHorizontal: 14, height: 48,
    fontWeight: '500', fontSize: 15, color: C.navy,
  },
  searchBtn: {
    backgroundColor: C.cyan, borderRadius: 10, paddingHorizontal: 18,
    alignItems: 'center', justifyContent: 'center', height: 48,
  },
  searchBtnText: { fontWeight: '700', fontSize: 14, color: '#fff' },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, gap: 8 },
  empty: {
    padding: 40, alignItems: 'center',
    borderWidth: 1.5, borderColor: C.borderDark, borderStyle: 'dashed',
    borderRadius: 14, backgroundColor: C.white, marginTop: 8,
  },
  emptyTitle: { fontWeight: '700', fontSize: 17, color: C.navy },
  emptyBody: { fontSize: 14, color: C.muted, marginTop: 6, textAlign: 'center' },

  readingCard: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  readingLeft: { flex: 1, gap: 3 },
  readingMac: { fontFamily: 'monospace', fontWeight: '600', fontSize: 13, color: C.navy },
  readingTime: { fontSize: 12, color: C.muted },
  readingRight: { alignItems: 'flex-end', gap: 2 },
  readingValue: { fontWeight: '800', fontSize: 20, color: C.navy },
  readingUnit: { fontWeight: '500', fontSize: 12, color: C.muted },
});
