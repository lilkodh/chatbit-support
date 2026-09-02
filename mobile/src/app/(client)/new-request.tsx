import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '../../services/api';

export default function NewRequestScreen() {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [initialMsg, setInitialMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => {
      const fullSubject = orderNumber.trim() ? `${subject.trim()} (Order #${orderNumber.trim()})` : subject.trim();
      const res = await conversationService.createConversation(fullSubject);
      const conv = res.data?.data || res.data;
      if (conv && conv.id && initialMsg.trim().length > 0) {
        try {
          await conversationService.sendMessage(conv.id, initialMsg.trim());
        } catch {}
      }
      return conv;
    },
    onSuccess: (conv) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (conv && conv.id) {
        router.replace({
          pathname: '/(client)/chat',
          params: { id: String(conv.id), subject: conv.subject || subject.trim() },
        } as any);
      } else {
        router.replace('/(client)');
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to create support request';
      setErrorMsg(msg);
    },
  });

  const handleStartChat = () => {
    if (!subject.trim()) {
      setErrorMsg('Please enter a subject');
      return;
    }
    if (createMutation.isPending) return;
    setErrorMsg('');
    createMutation.mutate();
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
            <Text style={styles.title}>New Support Request</Text>
            <Text style={styles.subtitle}>Start a new conversation with our support concierge.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>SUBJECT</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Brief summary of your issue..."
                placeholderTextColor="#A0AEC0"
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <Text style={styles.label}>ORDER NUMBER (OPTIONAL)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g., #SQ-12345"
                placeholderTextColor="#A0AEC0"
                value={orderNumber}
                onChangeText={setOrderNumber}
              />
            </View>

            <Text style={styles.label}>INITIAL MESSAGE (OPTIONAL)</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={styles.textArea}
                placeholder="Describe your issue in detail..."
                placeholderTextColor="#A0AEC0"
                value={initialMsg}
                onChangeText={setInitialMsg}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {!!errorMsg && (
              <Text style={{ color: '#D32F2F', fontSize: 13, marginTop: 12, textAlign: 'center', fontWeight: 'bold' }}>
                {errorMsg}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.startBtn, createMutation.isPending && { opacity: 0.7 }]}
              onPress={handleStartChat}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.startBtnText}>SUBMIT REQUEST</Text>
                  <Ionicons name="send" size={16} color={Colors.white} />
                </>
              )}
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
  label: { fontSize: 12, fontWeight: 'bold', color: '#334155', marginBottom: 8, marginTop: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, height: 50, backgroundColor: '#F8FAFC' },
  input: { flex: 1, color: '#0F172A', fontSize: 14, fontWeight: '500' },
  textAreaContainer: { height: 100, alignItems: 'flex-start', paddingTop: 12 },
  textArea: { flex: 1, color: '#0F172A', fontSize: 14, fontWeight: '500', width: '100%' },
  startBtn: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 8, marginTop: 24, gap: 8 },
  startBtnText: { color: Colors.white, fontSize: 14, fontWeight: 'bold' }
});