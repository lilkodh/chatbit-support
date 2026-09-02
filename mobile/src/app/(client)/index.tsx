import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '../../services/api';
import { connectSocket } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';

export default function ClientHomeScreen() {
  const { user, isLoading: authLoading, logout: handleLogout } = useAuth();
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

  const conversations: any[] = Array.isArray(data?.data?.data)
    ? data.data.data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'en_attente':
        return { label: 'en_attente', color: '#FF9800', bg: '#FFF3E0' };
      case 'in_progress':
      case 'en_cours':
        return { label: 'en_cours', color: '#4CAF50', bg: '#E8F5E9' };
      case 'closed':
        return { label: 'closed', color: '#757575', bg: '#EEEEEE' };
      default:
        return { label: status, color: Colors.primary, bg: Colors.background };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="chatbubbles" size={24} color={Colors.primary} />
          <Text style={styles.logoText}>ChatBit</Text>
        </View>

        <TouchableOpacity
          onPress={onLogoutPress}
          style={styles.logoutBtn}
        >
          <Ionicons name="log-out-outline" size={16} color="#D32F2F" />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Conversations</Text>
        <Text style={styles.subtitle}>Track and manage your support requests.</Text>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : isError ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: 'red', marginBottom: 10 }}>Failed to load conversations</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
              <Text style={{ color: Colors.white, fontWeight: 'bold' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : conversations.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Ionicons name="chatbox-ellipses-outline" size={48} color={Colors.textLight} />
            <Text style={{ color: Colors.textLight, marginTop: 12, fontSize: 14 }}>No support requests yet.</Text>
            <Text style={{ color: Colors.textLight, fontSize: 12, marginTop: 4 }}>Tap below to create one.</Text>
          </View>
        ) : (
          conversations.map((item) => {
            const badge = getStatusBadge(item.status);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: '/(client)/chat',
                    params: { id: String(item.id), subject: item.subject },
                  } as any)
                }
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardSubject}>{item.subject}</Text>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardMeta}>Request #{item.id}</Text>
                  <Text style={styles.cardTime}>
                    {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push('/(client)/new-request')}
        >
          <Ionicons name="add-circle" size={22} color={Colors.white} />
          <Text style={styles.createBtnText}>New Support Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', borderColor: '#FFCDD2', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 },
  logoutBtnText: { color: '#D32F2F', fontSize: 12, fontWeight: 'bold' },
  titleContainer: { paddingHorizontal: 20, marginTop: 16, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textLight, marginTop: 4 },
  listContainer: { flex: 1, paddingHorizontal: 20 },
  card: { backgroundColor: Colors.white, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardSubject: { fontSize: 16, fontWeight: 'bold', color: Colors.text, flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardMeta: { fontSize: 12, color: Colors.textLight },
  cardTime: { fontSize: 12, color: Colors.textLight },
  retryBtn: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  bottomSection: { padding: 16, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.white },
  createBtn: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 12, gap: 8 },
  createBtnText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});
