import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { apiClient } from '../utils/api';

interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  industry: string;
  rolesAimed: string[];
  recentPlacements: number;
}

export default function CompanyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await apiClient.get(`/companies/${id}`);
        setCompany(response.data);
      } catch (error) {
        console.error("Failed to fetch company details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!company) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.white }}>Company not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>{company.name.charAt(0)}</Text>
        </View>
        <Text style={styles.companyName}>{company.name}</Text>
        <Text style={styles.companyIndustry}>{company.industry}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.websiteButton}>
            <Ionicons name="globe-outline" size={18} color={COLORS.surface} />
            <Text style={styles.websiteButtonText}>Visit Website</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{company.description}</Text>
        </View>

        <View style={styles.statsCard}>
          <Ionicons name="people" size={24} color={COLORS.primary} />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.statsLabel}>TKMCE Students Placed</Text>
            <Text style={styles.statsNumber}>{company.recentPlacements} Students</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Open Roles</Text>
          <View style={styles.tagsContainer}>
            {company.rolesAimed.map((role, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{role}</Text>
              </View>
            ))}
          </View>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 80,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  companyIndustry: {
    fontSize: 16,
    color: COLORS.grey,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  websiteButtonText: {
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
  },
  description: {
    color: '#ddd',
    fontSize: 15,
    lineHeight: 24,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 30,
  },
  statsLabel: {
    fontSize: 13,
    color: COLORS.grey,
    marginBottom: 4,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 14,
  }
});
