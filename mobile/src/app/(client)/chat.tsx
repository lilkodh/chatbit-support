import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { router } from 'expo-router';

export default function ClientChatScreen() {
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <View style={styles.profileContainer}>
            <View>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?img=32' }} 
                style={styles.avatar} 
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.agentName}>Fatima</Text>
              <Text style={styles.agentRole}>Support Agent</Text>
            </View>
          </View>
          
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
       
        <ScrollView contentContainerStyle={styles.chatContainer} showsVerticalScrollIndicator={false}>
                  
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Today</Text>
          </View>
        
          <View style={styles.messageWrapperAgent}>
            <View style={styles.bubbleAgent}>
              <Text style={styles.textAgent}>Hello! Welcome to Souq Express Concierge. My name is Fatima. How can I assist you with your order today?</Text>
            </View>
            <Text style={styles.timeAgent}>10:42 AM</Text>
          </View>
         
          <View style={styles.messageWrapperClient}>
            <View style={styles.bubbleClient}>
              <Text style={styles.textClient}>Hi Fatima, I recently placed an order for some artisanal rugs (#ORD-9281) but I realized I selected the wrong delivery address. Can we update it before it ships?</Text>
            </View>
            <Text style={styles.timeClient}>10:45 AM</Text>
          </View>
         
          <View style={styles.messageWrapperAgent}>
            <View style={styles.bubbleAgent}>
              <Text style={styles.textAgent}>I can certainly help with that! Let me pull up order #ORD-9281 for you.</Text>
            </View>
          </View>
         
          <View style={styles.messageWrapperAgent}>
            <View style={styles.bubbleAgent}>
              <Text style={styles.textAgent}>It looks like the order is still in processing, so we have time to update the address. Could you please provide the correct shipping address?</Text>
            </View>
            <Text style={styles.timeAgent}>10:46 AM</Text>
          </View>
        
          <View style={styles.messageWrapperClient}>
            <View style={styles.bubbleClient}>
              <Text style={styles.textClient}>Yes, it should be delivered to 45 Medina Square, Marrakech, 40000.</Text>
            </View>
            <Text style={styles.timeClient}>10:47 AM</Text>
          </View>

        </ScrollView>

        <View style={styles.inputSection}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="attach" size={22} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
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
  onlineIndicator: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: Colors.white },
  headerTextContainer: { marginLeft: 12 },
  agentName: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  agentRole: { fontSize: 12, color: Colors.textLight },
  
  chatContainer: { padding: 16, paddingBottom: 20 },
  dateContainer: { alignItems: 'center', marginBottom: 20 },
  dateText: { fontSize: 12, color: Colors.text, backgroundColor: Colors.background, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  
  messageWrapperAgent: { alignItems: 'flex-start', marginBottom: 16, maxWidth: '85%' },
  bubbleAgent: { backgroundColor: Colors.background, padding: 14, borderRadius: 16, borderTopLeftRadius: 4 },
  textAgent: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  timeAgent: { fontSize: 10, color: Colors.textLight, marginTop: 4, marginLeft: 4 },
  
  messageWrapperClient: { alignItems: 'flex-end', marginBottom: 16, alignSelf: 'flex-end', maxWidth: '85%' },
  bubbleClient: { backgroundColor: Colors.primary, padding: 14, borderRadius: 16, borderTopRightRadius: 4 },
  textClient: { fontSize: 14, color: Colors.white, lineHeight: 20 },
  timeClient: { fontSize: 10, color: Colors.textLight, marginTop: 4, marginRight: 4 },
  
  inputSection: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.white },
  attachBtn: { padding: 8 },
  textInput: { flex: 1, backgroundColor: Colors.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: Colors.text, marginHorizontal: 8, minHeight: 40 },
  sendBtn: { backgroundColor: '#9E6754', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});