import { Tabs, Redirect } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAuth } from '../../src/context/AuthContext';
import { C } from '../../src/theme';

function TabIcon({ name, color }) {
  if (name === 'dashboard') return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path d="M3 9l8-6 8 6v10a1 1 0 01-1 1h-4v-6H8v6H4a1 1 0 01-1-1V9z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </Svg>
  );
  if (name === 'readings') return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path d="M3 12l4-4 4 4 4-6 4 3" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 20h16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
  if (name === 'settings') return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Circle cx="11" cy="11" r="3" stroke={color} strokeWidth="1.8" />
      <Path d="M11 1.5v3M11 17.5v3M20.5 11h-3M4.5 11h-3M17.7 4.3l-2.1 2.1M6.4 15.6l-2.1 2.1M17.7 17.7l-2.1-2.1M6.4 6.4L4.3 4.3"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
  return null;
}

export default function AppLayout() {
  const { token } = useAuth();
  if (!token) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: C.cyan,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color }) => <TabIcon name={route.name} color={color} />,
      })}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Sites' }} />
      <Tabs.Screen name="readings" options={{ title: 'Readings' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      {/* register is a full-screen flow, hide from tab bar */}
      <Tabs.Screen name="register" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1, borderTopColor: C.border,
    backgroundColor: C.white, paddingBottom: 4, height: 60,
  },
  tabLabel: {
    fontWeight: '600', fontSize: 11, letterSpacing: 0.5,
  },
});
