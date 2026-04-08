import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, StyleSheet
} from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSignUp } from "@clerk/clerk-expo";
import { COLORS } from '../constants/theme';
import { apiClient } from '../utils/api';

export default function Register() {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress.endsWith("@tkmce.ac.in")) {
      alert("Only @tkmce.ac.in email addresses are permitted to register.");
      return;
    }

    setLoading(true);
    try {
      await signUp.create({ emailAddress, password, firstName, lastName });
      await apiClient.post('/users/register', {
        email: emailAddress,
        firstName, lastName,
        rollNumber, branch,
        graduationYear, linkedin, github,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      alert("Check your college email for a verification code!");
    } catch (err: any) {
      alert(err.errors?.[0]?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={36} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>TKMCE Placement Cell</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>

        <Text style={styles.sectionLabel}>Personal Info</Text>
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="First Name" placeholderTextColor={COLORS.grey}
            value={firstName} onChangeText={setFirstName} />
          <TextInput style={[styles.input, { flex: 1 }]}
            placeholder="Last Name" placeholderTextColor={COLORS.grey}
            value={lastName} onChangeText={setLastName} />
        </View>

        <TextInput style={styles.input}
          placeholder="College Email (@tkmce.ac.in)"
          placeholderTextColor={COLORS.grey}
          value={emailAddress} onChangeText={setEmailAddress}
          autoCapitalize="none" keyboardType="email-address" />

        <View style={styles.passwordContainer}>
          <TextInput style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor={COLORS.grey}
            value={password} onChangeText={setPassword}
            secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={COLORS.grey} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Academic Details</Text>
        <TextInput style={styles.input}
          placeholder="Roll Number (e.g. TKM22CS001)"
          placeholderTextColor={COLORS.grey}
          value={rollNumber} onChangeText={setRollNumber}
          autoCapitalize="characters" />

        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Branch (CS, EC...)" placeholderTextColor={COLORS.grey}
            value={branch} onChangeText={setBranch} autoCapitalize="characters" />
          <TextInput style={[styles.input, { flex: 1 }]}
            placeholder="Graduation Year" placeholderTextColor={COLORS.grey}
            value={graduationYear} onChangeText={setGraduationYear}
            keyboardType="numeric" />
        </View>

        <Text style={styles.sectionLabel}>Online Profiles <Text style={styles.optional}>(optional)</Text></Text>
        <View style={styles.iconInput}>
          <Ionicons name="logo-linkedin" size={20} color="#0A66C2" style={styles.icon} />
          <TextInput style={styles.iconTextInput}
            placeholder="LinkedIn URL" placeholderTextColor={COLORS.grey}
            value={linkedin} onChangeText={setLinkedin} autoCapitalize="none" />
        </View>
        <View style={styles.iconInput}>
          <Ionicons name="logo-github" size={20} color={COLORS.white} style={styles.icon} />
          <TextInput style={styles.iconTextInput}
            placeholder="GitHub URL" placeholderTextColor={COLORS.grey}
            value={github} onChangeText={setGithub} autoCapitalize="none" />
        </View>

      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={onSignUpPress} disabled={loading}>
        {loading
          ? <ActivityIndicator color={COLORS.white} />
          : <Text style={styles.buttonText}>Create Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginLink}>
        <Text style={styles.loginText}>
          Already registered?{" "}
          <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Sign In</Text>
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, paddingBottom: 60 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 36 },
  logoContainer: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: `rgba(99,102,241,0.15)`,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.grey },
  form: { gap: 12 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginTop: 8, letterSpacing: 1, textTransform: 'uppercase' },
  optional: { color: COLORS.grey, fontWeight: '400', textTransform: 'none' },
  row: { flexDirection: 'row' },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, padding: 14,
    color: COLORS.white, fontSize: 15,
  },
  passwordContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12,
  },
  passwordInput: { flex: 1, padding: 14, color: COLORS.white, fontSize: 15 },
  eyeButton: { padding: 14 },
  iconInput: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12,
  },
  icon: { paddingLeft: 14 },
  iconTextInput: { flex: 1, padding: 14, color: COLORS.white, fontSize: 15 },
  button: {
    backgroundColor: COLORS.primary, borderRadius: 14, padding: 16,
    alignItems: 'center', marginTop: 30,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  buttonText: { color: COLORS.white, fontSize: 17, fontWeight: 'bold' },
  loginLink: { alignItems: 'center', marginTop: 20 },
  loginText: { color: COLORS.grey, fontSize: 14 },
});
