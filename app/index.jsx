import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { C } from '../src/theme';

export default function Index() {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.white }}>
        <ActivityIndicator color={C.cyan} size="large" />
      </View>
    );
  }
  return <Redirect href={token ? '/(app)/dashboard' : '/(auth)/login'} />;
}
