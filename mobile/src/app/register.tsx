import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { router } from 'expo-router';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const { login: setAuth } = useAuth();
  const [role, setRole] = useState<'client' | 'agent'>('client');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const { token, user } = await authService.register({ full_name: fullName, email, password, role });
      await setAuth(token, user);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.brandTitle}>Create Account</Text>
          <Text style={styles.brandSubtitle}>Join ChatBit to get started</Text>
        </View>

        <View style={styles.card}>
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#D32F2F" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Select Role</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'client' && styles.roleBtnActive]}
              onPress={() => setRole('client')}
            >
              <Ionicons name="person-outline" size={20} color={role === 'client' ? '#FFFFFF' : Colors.primary} />
              <Text style={[styles.roleBtnText, role === 'client' && styles.roleBtnTextActive]}>Client</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, role === 'agent' && styles.roleBtnActive]}
              onPress={() => setRole('agent')}
            >
              <Ionicons name="headset-outline" size={20} color={role === 'agent' ? '#FFFFFF' : Colors.primary} />
              <Text style={[styles.roleBtnText, role === 'agent' && styles.roleBtnTextActive]}>Agent</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#A0AEC0"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#A0AEC0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#A0AEC0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.linkText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.primary },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  backBtn: { position: 'absolute', left: 0, top: 0, padding: 8 },
  brandTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginTop: 10 },
  brandSubtitle: { fontSize: 14, color: '#FFFFFF', opacity: 0.9, marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', padding: 12, borderRadius: 8, marginBottom: 16, gap: 8 },
  errorText: { color: '#D32F2F', fontSize: 13, flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  roleContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  roleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, gap: 8 },
  roleBtnActive: { backgroundColor: Colors.primary },
  roleBtnText: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  roleBtnTextActive: { color: '#FFFFFF' },
  inputGroup: { marginBottom: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, backgroundColor: '#F8FAFC', paddingHorizontal: 12, height: 48 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: '100%', color: '#0F172A', fontSize: 14, fontWeight: '500' },
  eyeIcon: { padding: 4 },
  submitBtn: { backgroundColor: Colors.primary, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 6 },
  footerText: { fontSize: 14, color: '#64748B' },
  linkText: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
});