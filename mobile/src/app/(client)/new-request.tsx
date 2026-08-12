import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { router } from 'expo-router';

export default function NewRequestScreen() {
  const [subject, setSubject] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleStartChat = () => {
    console.log("Chat started with:", { subject, orderNumber, message });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>         
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={20} color={Colors.text} />
            <Text style={styles.backText}>BACK</Text>
          </TouchableOpacity>
       
          <View style={styles.header}>
            <Text style={styles.title}>New Request</Text>
            <Text style={styles.subtitle}>Start a new conversation with our support concierge.</Text>
          </View>
        
          <View style={styles.card}>
                     
            <Text style={styles.label}>SUBJECT</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Select an issue type or type here..."
                placeholderTextColor={Colors.textLight}
                value={subject}
                onChangeText={setSubject}
              />
              <Ionicons name="chevron-down-outline" size={20} color={Colors.textLight} />
            </View>
         
            <Text style={styles.label}>ORDER NUMBER (OPTIONAL)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g., #SQ-12345"
                placeholderTextColor={Colors.textLight}
                value={orderNumber}
                onChangeText={setOrderNumber}
              />
            </View>
           
            <Text style={styles.label}>INITIAL MESSAGE</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={styles.textArea}
                placeholder="Briefly describe how we can help you today..."
                placeholderTextColor={Colors.textLight}
                value={message}
                onChangeText={setMessage}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
           
            <TouchableOpacity style={styles.startBtn} onPress={handleStartChat}>
              <Text style={styles.startBtnText}>START CHAT</Text>
              <Ionicons name="send" size={16} color={Colors.white} />
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scrollContainer: { padding: 20, flexGrow: 1 },
  
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 4 },
  backText: { fontSize: 14, fontWeight: 'bold', color: Colors.text },
  
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textLight, lineHeight: 20 },
  
  card: { backgroundColor: Colors.white, padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  
  label: { fontSize: 12, fontWeight: 'bold', color: Colors.textLight, marginBottom: 8, marginTop: 16 },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 12, height: 50, backgroundColor: Colors.white },
  input: { flex: 1, color: Colors.text, fontSize: 14 },
  
  textAreaContainer: { height: 100, alignItems: 'flex-start', paddingTop: 12 },
  textArea: { flex: 1, color: Colors.text, fontSize: 14, width: '100%' },
  
  startBtn: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 8, marginTop: 24, gap: 8 },
  startBtnText: { color: Colors.white, fontSize: 14, fontWeight: 'bold' }
});