import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '../../services/api';
import {
  connectSocket,
  joinConversationRoom,
  leaveConversationRoom,
  sendSocketMessage,
  startTypingSocket,
  stopTypingSocket,
} from '../../services/socket';
import { useAuth } from '../../context/AuthContext';

const extractMessagesList = (dataObj: any): any[] => {
  if (!dataObj) return [];
  if (Array.isArray(dataObj)) return dataObj;
  if (Array.isArray(dataObj.messages)) return dataObj.messages;
  if (Array.isArray(dataObj.data?.messages)) return dataObj.data.messages;
  if (Array.isArray(dataObj.data)) return dataObj.data;
  return [];
};

export default function ClientChatScreen() {
  const { user, isLoading: authLoading, logout: handleLogout } = useAuth();
  const { id, subject } = useLocalSearchParams<{ id?: string; subject?: string }>();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(user);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isOtherOnline, setIsOtherOnline] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const typingTimerRef = useRef<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => conversationService.getMessages(id!, 1, 20),
    enabled: !authLoading && !!id && !!user,
  });

  const messages = extractMessagesList(data?.data);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (data?.data?.conversation?.status === 'closed') {
      setIsClosed(true);
    }
  }, [data]);

  useEffect(() => {
    if (!id || !user) return;

    let socketInstance: any = null;
    let isMounted = true;

    connectSocket().then((s) => {
      if (!isMounted || !s) return;
      socketInstance = s;

      joinConversationRoom(id);

      const handleNewMessage = (newMsg: any) => {
        if (!isMounted) return;
        if (Number(newMsg.conversation_id) === Number(id)) {
          queryClient.setQueryData(['messages', id], (old: any) => {
            const oldList = extractMessagesList(old?.data);
            if (oldList.some((m: any) => Number(m.id) === Number(newMsg.id))) return old;
            const updated = [...oldList, newMsg];
            if (old?.data?.messages) {
              return { ...old, data: { ...old.data, messages: updated } };
            }
            return { success: true, data: { messages: updated } };
          });
        }
      };

      const handleTypingUpdate = (typingData: { userId: number; isTyping: boolean }) => {
        if (!isMounted) return;
        if (currentUser && Number(typingData.userId) !== Number(currentUser.id)) {
          setIsOtherTyping(typingData.isTyping);
        }
      };

      const handlePresenceUpdate = (presenceData: { userId: number; isOnline: boolean }) => {
        if (!isMounted) return;
        if (currentUser && Number(presenceData.userId) !== Number(currentUser.id)) {
          setIsOtherOnline(presenceData.isOnline);
        }
      };

      const handleConversationUpdated = (convData: { conversationId: number; status: string }) => {
        if (!isMounted) return;
        if (Number(convData.conversationId) === Number(id)) {
          if (convData.status === 'closed') {
            setIsClosed(true);
          }
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      };

      const handleSocketError = (err: { message: string }) => {
        if (!isMounted) return;
        setErrorMsg(err.message || 'Error sending message');
      };

      s.on('message:new', handleNewMessage);
      s.on('typing:update', handleTypingUpdate);
      s.on('presence:update', handlePresenceUpdate);
      s.on('conversation:updated', handleConversationUpdated);
      s.on('socket:error', handleSocketError);
      s.on('error', handleSocketError);
    });

    return () => {
      isMounted = false;
      leaveConversationRoom(id);
      if (socketInstance) {
        socketInstance.off('message:new');
        socketInstance.off('typing:update');
        socketInstance.off('presence:update');
        socketInstance.off('conversation:updated');
        socketInstance.off('socket:error');
        socketInstance.off('error');
      }
    };
  }, [id, currentUser, user]);

  const onLogoutPress = async () => {
    await handleLogout();
  };

  const handleInputChange = (text: string) => {
    setMessage(text);
    if (!id || isClosed) return;

    if (text.trim().length > 0) {
      startTypingSocket(id);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        stopTypingSocket(id);
      }, 1500);
    } else {
      stopTypingSocket(id);
    }
  };

  const handleSendMessage = async () => {
    const textToSend = message.trim();
    if (!textToSend || !id) return;
    if (isClosed) {
      setErrorMsg('Conversation is closed');
      return;
    }
    setErrorMsg('');
    setMessage('');
    stopTypingSocket(id);

    // Ensure socket is connected and room is joined
    const s = await connectSocket();
    if (!s || !s.connected) {
      setErrorMsg('Socket re-connecting... Please try again in a moment');
      return;
    }

    joinConversationRoom(id);
    sendSocketMessage(id, textToSend);
  };

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
              <View
                style={[
                  styles.onlineIndicator,
                  { backgroundColor: isOtherOnline ? '#4CAF50' : '#9E9E9E' },
                ]}
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.agentName}>{subject || 'Support Chat'}</Text>
              <Text style={styles.agentRole}>
                {isOtherTyping ? 'Typing...' : isClosed ? 'Closed' : isOtherOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={onLogoutPress} style={{ padding: 4 }}>
            <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
          </TouchableOpacity>
        </View>

        {!!errorMsg && (
          <View style={{ backgroundColor: '#FFEBEE', padding: 8, alignItems: 'center' }}>
            <Text style={{ color: '#D32F2F', fontSize: 13 }}>{errorMsg}</Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.chatContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Today</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
          ) : !Array.isArray(messages) || messages.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: Colors.textLight }}>No messages yet. Send a message to start.</Text>
            </View>
          ) : (
            messages.map((msg: any) => {
              const isMine = currentUser && Number(msg.sender_id) === Number(currentUser.id);
              return (
                <View
                  key={msg.id || String(Math.random())}
                  style={isMine ? styles.messageWrapperClient : styles.messageWrapperAgent}
                >
                  <View style={isMine ? styles.bubbleClient : styles.bubbleAgent}>
                    <Text style={isMine ? styles.textClient : styles.textAgent}>{msg.content}</Text>
                  </View>
                  <Text style={isMine ? styles.timeClient : styles.timeAgent}>
                    {msg.created_at || msg.sent_at ? new Date(msg.created_at || msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={styles.inputSection}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="attach" size={22} color={Colors.textLight} />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder={isClosed ? 'Conversation is closed' : 'Type your message...'}
            placeholderTextColor="#A0AEC0"
            value={message}
            onChangeText={handleInputChange}
            editable={!isClosed}
          />

          <TouchableOpacity
            style={[styles.sendBtn, isClosed && { backgroundColor: '#CCC' }]}
            onPress={handleSendMessage}
            disabled={isClosed}
          >
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
  textInput: { flex: 1, backgroundColor: '#F7FAFC', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#1A202C', marginHorizontal: 8, minHeight: 40 },
  sendBtn: { backgroundColor: '#005C5D', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});