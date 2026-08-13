import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { router } from 'expo-router';

export default function AgentChatScreen() {
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <View style={styles.profileContainer}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.clientName}>Omar K.</Text>
              <Text style={styles.clientOrder}>Order #1234</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="checkmark-done-circle-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.chatContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Today</Text>
          </View>

          <View style={styles.messageWrapperClient}>
            <View style={styles.bubbleClient}>
              <Text style={styles.textClient}>I received the wrong item in my package. I ordered a blue rug but got a red one.</Text>
            </View>
            <Text style={styles.timeClient}>10:45 AM</Text>
          </View>

          <View style={styles.messageWrapperAgent}>
            <View style={styles.bubbleAgent}>
              <Text style={styles.textAgent}>Hello Omar, I apologize for the mistake! Let me check your order right away and arrange a replacement.</Text>
            </View>
            <Text style={styles.timeAgent}>10:48 AM</Text>
          </View>

        </ScrollView>

        <View style={styles.inputSection}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="document-text-outline" size={22} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Type your reply to Omar..."
            placeholderTextColor={Colors.textLight}
            value={message}
            onChangeText={setMessage}
          />
          
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="send" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.white },
  backBtn: { marginRight: 12 },
  profileContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  headerTextContainer: { marginLeft: 12 },
  clientName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  clientOrder: { fontSize: 12, color: '#A25946', fontWeight: '600' },
  actionBtn: { padding: 4 },
  
  chatContainer: { padding: 16, paddingBottom: 20 },
  dateContainer: { alignItems: 'center', marginBottom: 20 },
  dateText: { fontSize: 12, color: Colors.text, backgroundColor: Colors.background, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  
  messageWrapperClient: { alignItems: 'flex-start', marginBottom: 16, maxWidth: '85%' },
  bubbleClient: { backgroundColor: Colors.background, padding: 14, borderRadius: 16, borderTopLeftRadius: 4 },
  textClient: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  timeClient: { fontSize: 10, color: Colors.textLight, marginTop: 4, marginLeft: 4 },
  
  messageWrapperAgent: { alignItems: 'flex-end', marginBottom: 16, alignSelf: 'flex-end', maxWidth: '85%' },
  bubbleAgent: { backgroundColor: Colors.primary, padding: 14, borderRadius: 16, borderTopRightRadius: 4 },
  textAgent: { fontSize: 14, color: Colors.white, lineHeight: 20 },
  timeAgent: { fontSize: 10, color: Colors.textLight, marginTop: 4, marginRight: 4 },
  
  inputSection: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.white },
  attachBtn: { padding: 8 },
  textInput: { flex: 1, backgroundColor: Colors.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: Colors.text, marginHorizontal: 8, minHeight: 40 },
  sendBtn: { backgroundColor: Colors.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});