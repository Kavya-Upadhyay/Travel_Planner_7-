import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../api/apiClient';
import { setCredentials } from '../store/authSlice';

const { width } = Dimensions.get('window');
const SANS_FONT = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';

const THEME = {
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  glassBg: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
};

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const dispatch = useDispatch();

  const handleAuth = async () => {
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { email, password, fullName };
      
      const response = await apiClient.post(endpoint, payload);
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      dispatch(setCredentials({ user, token }));
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <LinearGradient colors={['#141E30', '#243B55', '#0f2027']} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Join Us'}</Text>
        <Text style={styles.subtitle}>{isLogin ? 'Log in to continue your journey' : 'Create an account to start planning'}</Text>
        
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={THEME.textSecondary}
            value={fullName}
            onChangeText={setFullName}
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor={THEME.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={THEME.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity onPress={handleAuth} activeOpacity={0.8} style={{ marginTop: 10 }}>
          <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.button} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
            <Text style={styles.buttonText}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Text style={styles.switchTextHighlight}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: THEME.glassBg,
    padding: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    elevation: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: THEME.textPrimary,
    letterSpacing: -1,
    fontFamily: SANS_FONT,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.textSecondary,
    marginBottom: 40,
    fontFamily: SANS_FONT,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    color: THEME.textPrimary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: SANS_FONT,
  },
  button: {
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#00c6ff',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 5,
  },
  buttonText: {
    color: THEME.textPrimary,
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 0.5,
    fontFamily: SANS_FONT,
  },
  switchText: {
    marginTop: 30,
    textAlign: 'center',
    color: THEME.textSecondary,
    fontWeight: '500',
    fontSize: 16,
    fontFamily: SANS_FONT,
  },
  switchTextHighlight: {
    color: '#00c6ff',
    fontWeight: '800',
  },
});
