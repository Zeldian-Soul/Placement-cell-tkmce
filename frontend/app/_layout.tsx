import { ClerkProvider, ClerkLoaded, useAuth, useUser } from '@clerk/clerk-expo';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { tokenCache } from './cache';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_ZXhjaXRlZC1oYXdrLTQ3LmNsZXJrLmFjY291bnRzLmRldiQ";

const ALLOWED_DOMAIN = "@tkmce.ac.in";

const InitialLayout = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    // Domain restriction check
    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress || "";
      if (!email.endsWith(ALLOWED_DOMAIN)) {
        Alert.alert(
          "Access Denied",
          `Only students with a ${ALLOWED_DOMAIN} email address can use this app.`,
          [{ text: "OK", onPress: () => signOut() }]
        );
        return;
      }
    }

    const inTabsGroup = segments[0] === '(tabs)';

    if (isSignedIn && !inTabsGroup) {
      router.replace('/(tabs)');
    } else if (!isSignedIn && segments[0] !== '(auth)') {
      router.replace('/(auth)/login');
    }
  }, [isSignedIn, isLoaded, segments, user]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
