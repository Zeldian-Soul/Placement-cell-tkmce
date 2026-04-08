import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { apiClient } from '../utils/api';

interface StudentStats {
  cgpa: string;
  appliedRoles: number;
  interviews: number;
}

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Here we might send the currently logged in user ID to get our specific DB stats
        const response = await apiClient.get(`/users/me/stats?authId=${user?.id}`);
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch profile stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
       console.error("SignOut Failed", err);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{(user?.firstName || 'S')[0]}</Text>
          </View>
          <Text style={styles.userName}>{user?.fullName || 'Student User'}</Text>
          <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress || 'student@tkmce.ac.in'}</Text>
          <View style={styles.branchTag}>
            <Text style={styles.branchText}>Computer Science</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.statNumber}>{stats?.cgpa || '8.5'}</Text>}
            <Text style={styles.statLabel}>CGPA</Text>
          </View>
          <View style={styles.statBox}>
            {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.statNumber}>{stats?.appliedRoles || '12'}</Text>}
            <Text style={styles.statLabel}>Applied</Text>
          </View>
          <View style={styles.statBox}>
            {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.statNumber}>{stats?.interviews || '3'}</Text>}
            <Text style={styles.statLabel}>Interviews</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={22} color={COLORS.white} />
            <Text style={styles.menuText}>My Resume</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="bookmark-outline" size={22} color={COLORS.white} />
            <Text style={styles.menuText}>Saved Internships</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={22} color={COLORS.white} />
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
          </TouchableOpacity>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 12,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  userCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarLargeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.grey,
    marginBottom: 16,
  },
  branchTag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  branchText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.grey,
  },
  menuContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  menuText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 16,
  }
});
