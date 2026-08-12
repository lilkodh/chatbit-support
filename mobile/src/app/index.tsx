import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { Colors } from '../constants/colors';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [role, setRole] = useState<'client' | 'agent'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="chatbubbles-outline" size={24} color={Colors.primary} />
            <Text style={styles.logoText}>ChatBit</Text>
            <Text style={styles.companyText}>by Souq Express</Text>
          </View>
          <Ionicons name="help-circle-outline" size={24} color={Colors.textLight} />
        </View>

        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to ChatBit.</Text>
          </View>

          <Text style={styles.label}>I am a...</Text>
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
        
          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </View>
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
         
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/new-request' as any)}>
            <Text style={styles.loginButtonText}>Login</Text>
            <Ionicons name="log-in-outline" size={20} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerText}>Register here</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  companyText: { fontSize: 12, color: Colors.textLight, marginTop: 4 },
  
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
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotPassword: { fontSize: 12, color: Colors.textLight, marginBottom: 8, fontWeight: '600' },
  
  loginButton: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 8, marginTop: 10, gap: 8 },
  loginButtonText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 13, color: Colors.textLight },
  registerText: { fontSize: 13, color: Colors.primary, fontWeight: 'bold' }
});