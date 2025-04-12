// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.welcomeText}>¡Bienvenid@!</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Input
          placeholder="Escribe tu nombre de usuario"
          value={username}
          onChangeText={setUsername}
          icon="user"
        />
        
        <Input
          placeholder="Escribe tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon="lock"
        />
        
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        
        <Button 
          title="Iniciar sesión" 
          onPress={() => navigation.navigate('Dashboard')} 
          variant="primary"
        />
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.divider} />
        </View>
        
        <Button 
          title="Iniciar sesión con Google" 
          onPress={() => {}} 
          variant="outline"
          icon="google"
        />
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>¿Eres nuevo? </Text>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Crear cuenta nueva</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2429',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#A3E4D7',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A343D',
  },
  dividerText: {
    color: '#A0A0A0',
    paddingHorizontal: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  signupLink: {
    color: '#A3E4D7',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;