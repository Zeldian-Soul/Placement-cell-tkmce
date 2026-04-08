import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { apiClient } from '../utils/api';

interface DashboardStats {
  activeInternships: number;
  totalStudents: number;
  newExperiences: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await apiClient.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch admin dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <Text style={styles.headerSubtitle}>Placement Coordinator Tools</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Key Metrics */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="briefcase" size={24} color={COLORS.primary} />
            <Text style={styles.statLabel}>Internships</Text>
            {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.statNumber}>{stats?.activeInternships || 0}</Text>}
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color={COLORS.primary} />
            <Text style={styles.statLabel}>Students</Text>
            {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.statNumber}>{stats?.totalStudents || 0}</Text>}
          </View>
          <View style={styles.statCard}>
            <Ionicons name="chatbubbles" size={24} color={COLORS.primary} />
            <Text style={styles.statLabel}>Posts</Text>
            {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.statNumber}>{stats?.newExperiences || 0}</Text>}
          </View>
        </View>

        {/* Management Actions */}
        <Text style={styles.sectionTitle}>Manage Platform</Text>
        
        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/(admin)/manage-internships')}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(74, 222, 128, 0.15)' }]}>
            <Ionicons name="add-circle" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Manage Internships</Text>
            <Text style={styles.actionDesc}>Add, edit or remove open positions</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/(admin)/manage-faqs')}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
            <Ionicons name="help-circle" size={22} color="#38bdf8" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Update FAQs</Text>
            <Text style={styles.actionDesc}>Modify placement policies and help docs</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
        </TouchableOpacity>

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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.grey,
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  statNumber: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDesc: {
    color: COLORS.grey,
    fontSize: 12,
  }
});
