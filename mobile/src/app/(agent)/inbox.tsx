import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { router } from 'expo-router';

export default function AgentInboxScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <View style={styles.header}>
        <Text style={styles.logoText}>ChatBit</Text>
        <View style={styles.headerRight}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=32' }} style={styles.avatar} />
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.textLight} />
        </View>
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
          <View style={styles.badge}><Text style={styles.badgeText}>12</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active Chats</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity style={styles.chatItem} onPress={() => router.push('/(client)/chat')}>
          <View style={[styles.priorityBorder, { backgroundColor: '#A25946' }]} />
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.chatAvatar} />
          <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatName}>Omar K.</Text>
              <Text style={styles.chatTime}>2m ago</Text>
            </View>
            <View style={styles.tagContainer}>
              <Ionicons name="cube-outline" size={12} color="#A25946" />
              <Text style={[styles.tagText, { color: '#A25946' }]}>ORDER #1234</Text>
            </View>
            <Text style={styles.chatMessage} numberOfLines={1}>I received the wrong item in my package, ...</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatItem} onPress={() => router.push('/(client)/chat')}>
          <View style={[styles.priorityBorder, { backgroundColor: 'transparent' }]} />
          <View style={[styles.chatAvatar, { backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>SM</Text>
          </View>
          <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatName}>Sara M.</Text>
              <Text style={styles.chatTime}>15m ago</Text>
            </View>
            <View style={styles.tagContainer}>
              <Ionicons name="car-outline" size={12} color={Colors.primary} />
              <Text style={[styles.tagText, { color: Colors.primary }]}>DELIVERY ISSUE</Text>
            </View>
            <Text style={styles.chatMessage} numberOfLines={1}>The tracking says delivered but I haven't ...</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeNavIcon}>
            <Ionicons name="albums" size={24} color={Colors.white} />
          </View>
          <Text style={styles.navTextActive}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color={Colors.textLight} />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  logoText: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 30, height: 30, borderRadius: 15 },
  
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
  navText: { fontSize: 11, color: Colors.textLight }
});