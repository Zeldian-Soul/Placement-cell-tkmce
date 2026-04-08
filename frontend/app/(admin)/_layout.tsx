import { Stack } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { View, Text } from 'react-native';
import { COLORS } from '../constants/theme';

export default function AdminLayout() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;

  // Optional: Add Role Checking here
  // if (user?.publicMetadata?.role !== 'admin') {
  //   return <Text>Unauthorized</Text>;
  // }

  return <Stack screenOptions={{ headerShown: false }} />;
}
