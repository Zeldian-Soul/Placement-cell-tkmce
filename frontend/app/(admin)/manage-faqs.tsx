import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { apiClient } from '../utils/api';

interface FAQ {
  id: string;
  category: string;
  question: string;
}

export default function ManageFaqs() {
  const router = useRouter();
  const [data, setData] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await apiClient.get('/admin/faqs');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch admin faqs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const renderItem = ({ item }: { item: FAQ }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
        </View>
        <Text style={styles.questionText}>{item.question}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="pencil" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="trash" size={20} color={COLORS.grey} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage FAQs</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color={COLORS.surface} />
      </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardInfo: {
    flex: 1,
    paddingRight: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: "#eab308",
  },
  questionText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  }
});
