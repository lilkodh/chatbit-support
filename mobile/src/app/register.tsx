import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [role, setRole] = useState<'client' | 'agent'>('client');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="chatbubbles-outline" size={24} color={Colors.primary} />
            <Text style={styles.logoText}>ChatBit</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subtitle}>Join ChatBit by Souq Express today.</Text>
          </View>

          <Text style={styles.label}>Register as a...</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'client' && styles.roleButtonActive]}
              onPress={() => setRole('client')}
            >
              <Ionicons name="person-outline" size={20} color={role === 'client' ? Colors.white : Colors.primary} />
              <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>Client</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.roleButton, role === 'agent' && styles.roleButtonActive]}
              onPress={() => setRole('agent')}
            >
              <Ionicons name="headset-outline" size={20} color={role === 'agent' ? Colors.white : Colors.primary} />
              <Text style={[styles.roleText, role === 'agent' && styles.roleTextActive]}>Agent</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-circle-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Fatima Zahra"
              placeholderTextColor={Colors.textLight}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.registerBtn}>
            <Text style={styles.registerBtnText}>Create Account</Text>
            <Ionicons name="arrow-forward-outline" size={20} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginText}>Login here</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scrollContainer: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  
  header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  
  card: { backgroundColor: Colors.white, padding: 24, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  titleContainer: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textLight, marginTop: 8 },
  
  label: { fontSize: 12, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  roleButton: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, gap: 8 },
  roleButtonActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roleText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  roleTextActive: { color: Colors.white },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 12, height: 50, marginBottom: 16 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: Colors.text, fontSize: 14 },
  
  registerBtn: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 8, marginTop: 10, gap: 8 },
  registerBtnText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 13, color: Colors.textLight },
  loginText: { fontSize: 13, color: Colors.primary, fontWeight: 'bold' }
});