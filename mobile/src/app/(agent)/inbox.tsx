import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '../../services/api';
import { connectSocket } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';

export default function AgentInboxScreen() {
  const { user, isLoading: authLoading, logout: handleLogout } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: conversationService.getConversations,
    enabled: !authLoading && !!user,
  });

  useEffect(() => {
    let socketInstance: any = null;
    let isMounted = true;

    connectSocket().then((s) => {
      if (!isMounted || !s) return;
      socketInstance = s;

      const handleRefresh = () => {
        if (isMounted) {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      };

      s.on('conversation:updated', handleRefresh);
      s.on('presence:update', handleRefresh);
    });

    return () => {
      isMounted = false;
      if (socketInstance) {
        socketInstance.off('conversation:updated');
        socketInstance.off('presence:update');
      }
    };
  }, [queryClient]);

  const onLogoutPress = () => {
    handleLogout();
  };

  const allConversations: any[] = Array.isArray(data?.data?.data)
    ? data.data.data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  const pendingCount = allConversations.filter(
    (c) => c.status === 'pending' || c.status === 'en_attente'
  ).length;

  const filteredConversations = allConversations.filter((c) => {
    if (activeTab === 'pending') {
      return c.status === 'pending' || c.status === 'en_attente';
    }
    return c.status === 'in_progress' || c.status === 'en_cours';
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="headset" size={22} color={Colors.primary} />
          <Text style={styles.logoText}>ChatBit Agent</Text>
        </View>
        <TouchableOpacity
          onPress={onLogoutPress}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 }}
        >
          <Ionicons name="log-out-outline" size={18} color="#D32F2F" />
          <Text style={{ color: '#D32F2F', fontSize: 13, fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Agent Inbox</Text>
        <Text style={styles.subtitle}>Manage and resolve customer inquiries.</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending Requests</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingCount}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active Chats</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : isError ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>Error loading conversations</Text>
            <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 10 }}>
              <Text style={{ color: Colors.primary }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredConversations.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: Colors.textLight }}>No conversations found</Text>
          </View>
        ) : (
          filteredConversations.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.chatItem}
              onPress={() =>
                router.push({
                  pathname: '/(agent)/chat',
                  params: { id: String(item.id), subject: item.subject },
                } as any)
              }
            >
              <View
                style={[
                  styles.priorityBorder,
                  { backgroundColor: (item.status === 'pending' || item.status === 'en_attente') ? '#A25946' : Colors.primary },
                ]}
              />
              <View
                style={[
                  styles.chatAvatar,
                  { backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
                ]}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  {item.subject ? item.subject.charAt(0).toUpperCase() : 'C'}
                </Text>
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{item.subject}</Text>
                  <Text style={styles.chatTime}>
                    {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </Text>
                </View>
                <View style={styles.tagContainer}>
                  <Ionicons name="chatbubble-outline" size={12} color={Colors.primary} />
                  <Text style={[styles.tagText, { color: Colors.primary }]}>
                    STATUS: {item.status ? item.status.toUpperCase() : 'EN_ATTENTE'}
                  </Text>
                </View>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  Conversation #{item.id}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeNavIcon}>
            <Ionicons name="albums" size={24} color={Colors.white} />
          </View>
          <Text style={styles.navTextActive}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={onLogoutPress}>
          <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
          <Text style={[styles.navText, { color: '#D32F2F', fontWeight: 'bold' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  logoText: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  titleContainer: { paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textLight },
  tabContainer: { flexDirection: 'row', backgroundColor: Colors.background, marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10 },
  activeTab: { backgroundColor: Colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.textLight },
  activeTabText: { color: Colors.text },
  badge: { backgroundColor: '#A25946', borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: 'bold' },
  listContainer: { flex: 1 },
  chatItem: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.white },
  priorityBorder: { width: 3, height: '100%', position: 'absolute', left: 0, top: 16, bottom: 16, borderRadius: 2 },
  chatAvatar: { width: 46, height: 46, borderRadius: 23, marginLeft: 8 },
  chatContent: { flex: 1, marginLeft: 12 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: 15, fontWeight: 'bold', color: Colors.text },
  chatTime: { fontSize: 12, color: Colors.textLight },
  tagContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 4 },
  tagText: { fontSize: 10, fontWeight: 'bold' },
  chatMessage: { fontSize: 13, color: Colors.textLight },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border, paddingVertical: 10, backgroundColor: Colors.white, paddingBottom: 20 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  activeNavIcon: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 6, borderRadius: 16 },
  navTextActive: { fontSize: 11, fontWeight: 'bold', color: Colors.primary },
  navText: { fontSize: 11, color: Colors.textLight },
});