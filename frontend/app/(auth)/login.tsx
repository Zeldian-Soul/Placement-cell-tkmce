import React from "react";
import { View, Text, Image, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/auth.styles";
import { COLORS } from '../constants/theme';
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onSelectAuth = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <FontAwesome name="institution" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>Placement Cell</Text>
        <Text style={styles.tagline}>get placed from tkmce</Text>
      </View>
        
      <View style={styles.illustrationContainer}>
        {/* Using a placeholder if local image isn't available, but kept the local path from original code */}
        <Image
          source={require("../../assets/images/login-image.png")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={onSelectAuth}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to the Terms and Privacy Policy.
        </Text>
      </View>
    </View>
  );
}
