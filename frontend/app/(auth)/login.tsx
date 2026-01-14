import FontAwesome from '@expo/vector-icons/FontAwesome';import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/auth.styles";
import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
import { COLORS } from '../constants/theme';

export default function login() {
  return (
    <View style= {styles.container}>

        <View style= {styles.brandSection}>
            <View style= {styles.logoContainer}>
                <FontAwesome name="institution" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.appName}>Placement Cell</Text>
            <Text style={styles.tagline}>get placed from tkmce</Text>            
        </View>
        
        <View style={styles.illustrationContainer}>
          <Image
          source={require("../../assets/images/login-image.png")}
          style={styles.illustration}
          resizeMode="cover"
          />
        </View>

        <View style={styles.loginSection}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={()=> console.log("Continue with Google")}
            activeOpacity={0.9}
            >
              <View style={styles.googleIconContainer}>
                <Ionicons name="logo-google" size={20} color={COLORS.surface} />
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree the Terms and Privacy Policy.
          </Text>
        </View>
    
    </View>
  )
}
