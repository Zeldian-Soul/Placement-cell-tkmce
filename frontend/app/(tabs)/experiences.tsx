import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Modal, TextInput, KeyboardAvoidingView,
  Platform, ScrollView, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { COLORS } from '../constants/theme';
import { apiClient } from '../utils/api';

interface Experience {
  id: string;
  company: string;
  role: string;
  author: string;
  content: string;
  upvotes: number;
  comments: number;
  time: string;
}

export default function Experiences() {
  const { user } = useUser();
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [postModalVisible, setPostModalVisible] = useState(false);

  // New post form state
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newContent, setNewContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await apiClient.get('/experiences');
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id: string) => {
    setData(prev => prev.map(post =>
      post.id === id ? { ...post, upvotes: post.upvotes + 1 } : post
    ));
    try {
      await apiClient.post(`/experiences/${id}/upvote`);
    } catch (error) {
      console.error("Upvote failed", error);
    }
  };

  const handlePost = async () => {
    if (!newCompany.trim() || !newContent.trim()) {
      Alert.alert("Missing Fields", "Company and experience content are required.");
      return;
    }
    setPosting(true);
    try {
      const newPost = {
        company: newCompany,
        role: newRole || "General",
        content: newContent,
        authorEmail: user?.primaryEmailAddress?.emailAddress,
        author: user?.firstName || 'Student',
      };
      const response = await apiClient.post('/experiences', newPost);
      // Prepend optimistically
      setData(prev => [{
        id: response.data?.id || String(Date.now()),
        ...newPost,
        upvotes: 0,
        comments: 0,
        time: 'just now',
      }, ...prev]);
      setPostModalVisible(false);
      setNewCompany(''); setNewRole(''); setNewContent('');
    } catch (err) {
      console.error("Post failed", err);
    } finally {
      setPosting(false);
    }
  };

  const renderItem = ({ item }: { item: Experience }) => (
    <View style={styles.postCard}>
      {/* Vote column */}
      <View style={styles.voteSection}>
        <TouchableOpacity onPress={() => handleUpvote(item.id)} style={styles.voteButton}>
          <Ionicons name="caret-up" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.voteCount}>{item.upvotes}</Text>
        <TouchableOpacity style={styles.voteButton}>
          <Ionicons name="caret-down" size={22} color={COLORS.grey} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentSection}>
        <View style={styles.postHeader}>
          <View style={styles.tagGroup}>
            <Text style={styles.companyTag}>{item.company}</Text>
            <Text style={styles.roleTag}>{item.role}</Text>
          </View>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <Text style={styles.authorText}>u/{item.author}</Text>
        <Text style={styles.postContent} numberOfLines={5}>{item.content}</Text>

        <View style={styles.postFooter}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.grey} />
            <Text style={styles.actionText}>{item.comments} Comments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={16} color={COLORS.grey} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Interview Experiences</Text>
          <Text style={styles.headerSubtitle}>Real insights from campus placements</Text>
        </View>
        <TouchableOpacity style={styles.postButton} onPress={() => setPostModalVisible(true)}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Post Creation Modal */}
      <Modal visible={postModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Your Experience</Text>
              <TouchableOpacity onPress={() => setPostModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.grey} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalRow}>
                <TextInput
                  style={[styles.modalInput, { flex: 1, marginRight: 8 }]}
                  placeholder="Company Name *"
                  placeholderTextColor={COLORS.grey}
                  value={newCompany}
                  onChangeText={setNewCompany}
                />
                <TextInput
                  style={[styles.modalInput, { flex: 1 }]}
                  placeholder="Role / Position"
                  placeholderTextColor={COLORS.grey}
                  value={newRole}
                  onChangeText={setNewRole}
                />
              </View>

              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Share your interview experience, questions asked, tips for others..."
                placeholderTextColor={COLORS.grey}
                value={newContent}
                onChangeText={setNewContent}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />

              <View style={styles.modalFooter}>
                <Text style={styles.modalHint}>
                  <Ionicons name="information-circle-outline" size={13} color={COLORS.grey} />
                  {" "}Posting as {user?.firstName || 'Student'}
                </Text>
                <TouchableOpacity style={styles.submitButton} onPress={handlePost} disabled={posting}>
                  {posting
                    ? <ActivityIndicator color={COLORS.white} />
                    : <Text style={styles.submitText}>Post Experience</Text>
                  }
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  headerSubtitle: { fontSize: 13, color: COLORS.grey, marginTop: 2 },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
  listContainer: { padding: 14, paddingBottom: 80 },
  postCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  voteSection: { alignItems: 'center', marginRight: 14, width: 36 },
  voteButton: { padding: 4 },
  voteCount: { color: COLORS.white, fontWeight: 'bold', fontSize: 15, marginVertical: 2 },
  contentSection: { flex: 1 },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  tagGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 },
  companyTag: {
    backgroundColor: 'rgba(99,102,241,0.15)',
    color: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  roleTag: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 12,
  },
  timeText: { color: COLORS.grey, fontSize: 11, marginLeft: 4 },
  authorText: { color: COLORS.grey, fontSize: 12, marginBottom: 8 },
  postContent: { color: COLORS.white, fontSize: 14, lineHeight: 21, marginBottom: 12, opacity: 0.9 },
  postFooter: { flexDirection: 'row', gap: 16 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { color: COLORS.grey, fontSize: 12 },
  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: {
    backgroundColor: COLORS.surfaceLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40, height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
  modalRow: { flexDirection: 'row', marginBottom: 12 },
  modalInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    color: COLORS.white,
    fontSize: 15,
    marginBottom: 12,
  },
  textArea: { minHeight: 160 },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  modalHint: { color: COLORS.grey, fontSize: 12, flex: 1 },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  submitText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },
});
