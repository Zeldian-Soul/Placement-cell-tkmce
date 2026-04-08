import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { apiClient } from '../utils/api';

interface Internship {
  id: string;
  company: string;
  role: string;
  stipend: string;
  duration: string;
  type: string;
  tags: string[];
}

export default function Internships() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await apiClient.get('/internships');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch internships:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const filteredData = data.filter(item => 
    item.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Internship }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.companyIconPlaceholder}>
          <Text style={styles.companyIconLetter}>{item.company.charAt(0)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.roleTitle}>{item.role}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color={COLORS.grey} />
          <Text style={styles.detailText}>{item.stipend}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={COLORS.grey} />
          <Text style={styles.detailText}>{item.duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color={COLORS.grey} />
          <Text style={styles.detailText}>{item.type}</Text>
        </View>
      </View>

      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.applyButton} onPress={() => alert('Application sent for ' + item.role)}>
        <Text style={styles.applyButtonText}>Apply Now</Text>
        <Ionicons name="arrow-forward" size={18} color={COLORS.surface} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Internships</Text>
        <Text style={styles.headerSubtitle}>Kickstart your career</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.grey} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search roles or companies..."
            placeholderTextColor={COLORS.grey}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: 25,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  companyIconLetter: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  headerInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    color: '#ddd',
    fontSize: 13,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: '#ccc',
    fontSize: 12,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  applyButtonText: {
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: 16,
  }
});