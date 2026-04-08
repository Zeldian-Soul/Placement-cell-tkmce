import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, UIManager, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { apiClient } from '../utils/api';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

export default function Faqs() {
  const [data, setData] = useState<FAQCategory[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await apiClient.get('/faqs');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === id ? null : id);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Placement Help</Text>
        <Text style={styles.headerSubtitle}>Guidelines and frequently asked questions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.contactCard}>
          <View style={styles.contactIcon}>
            <Ionicons name="chatbubbles" size={24} color={COLORS.surface} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Need direct assistance?</Text>
            <Text style={styles.contactDesc}>Reach out to the placement coordinators.</Text>
          </View>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>

        {data.map((section, sIndex) => (
          <View key={sIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            
            {section.items.map((item, iIndex) => {
              const id = `${sIndex}-${iIndex}`;
              const isExpanded = expandedIndex === id;
              
              return (
                <View key={iIndex} style={styles.accordionContainer}>
                  <TouchableOpacity 
                    style={styles.accordionHeader} 
                    onPress={() => toggleExpand(id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.questionText}>{item.q}</Text>
                    <Ionicons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={COLORS.primary} 
                    />
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.accordionBody}>
                      <Text style={styles.answerText}>{item.a}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}

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
  contactCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  contactDesc: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 12,
  },
  contactButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  accordionContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    color: '#eee',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    paddingRight: 16,
    lineHeight: 22,
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  answerText: {
    color: COLORS.grey,
    fontSize: 14,
    lineHeight: 22,
  }
});