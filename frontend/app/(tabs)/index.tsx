import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { apiClient } from '../utils/api';

interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
}

export default function Index() {
  const router = useRouter();
  const { user } = useUser();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/announcements');
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Welcome Section */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.firstName || 'Student'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.avatarPlaceholder}>
            <Text style={styles.avatarLetter}>{(user?.firstName || 'S')[0]}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/internships')}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(74, 222, 128, 0.15)' }]}>
              <Ionicons name="briefcase" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.actionTitle}>Internships</Text>
            <Text style={styles.actionSub}>Apply to roles</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/experiences')}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Ionicons name="chatbubbles" size={24} color="#38bdf8" />
            </View>
            <Text style={styles.actionTitle}>Experiences</Text>
            <Text style={styles.actionSub}>Read reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Announcements Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Announcements</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : (
          announcements.map((item) => (
            <View key={item.id} style={styles.announcementCard}>
              <View style={styles.badgeRow}>
                <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardContent}>{item.content}</Text>
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 80,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.grey,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  actionSub: {
    fontSize: 13,
    color: COLORS.grey,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  announcementCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  dateText: {
    color: COLORS.grey,
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  cardContent: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 22,
  }
});
