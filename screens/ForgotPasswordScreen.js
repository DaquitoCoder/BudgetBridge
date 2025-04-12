import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import { Feather } from '@expo/vector-icons';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSendResetLink = () => {
    // Aquí iría la lógica para enviar el enlace de restablecimiento
    setIsSent(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color="#A3E4D7" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.title}>Recuperar contraseña</Text>
      </View>
      
      <View style={styles.formContainer}>
        {!isSent ? (
          <>
            <Text style={styles.description}>
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </Text>
            
            <Input
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              icon="mail"
              keyboardType="email-address"
            />
            
            <Button 
              title="Enviar enlace de recuperación" 
              onPress={handleSendResetLink} 
              variant="primary"
            />
          </>
        ) : (
          <>
            <View style={styles.successContainer}>
              <View style={styles.iconCircle}>
                <Feather name="check" size={32} color="#A3E4D7" />
              </View>
              <Text style={styles.successTitle}>¡Enlace enviado!</Text>
              <Text style={styles.successDescription}>
                Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada.
              </Text>
            </View>
            
            <Button 
              title="Volver al inicio de sesión" 
              onPress={() => navigation.navigate('Login')} 
              variant="primary"
            />
          </>
        )}
        
        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLinkText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
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
  backButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    color: '#A0A0A0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    color: '#A3E4D7',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(163, 228, 215, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  successDescription: {
    color: '#A0A0A0',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
});

export default ForgotPasswordScreen;