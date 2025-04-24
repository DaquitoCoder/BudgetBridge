import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

import * as SplashScreen from 'expo-splash-screen';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    SpaceGroteskRegular: require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('El correo electrónico es obligatorio');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Introduce un correo electrónico válido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSendResetLink = () => {
    // Aquí iría la lógica para enviar el enlace de restablecimiento
    if (!validateEmail(email)) return;

    setIsLoading(true);
    const auth = getAuth();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        setIsSent(true);
      })
      .catch((error) => {
        let errorMessage;
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage =
              'No existe ninguna cuenta con este correo electrónico';
            break;
          case 'auth/invalid-email':
            errorMessage = 'El formato del correo electrónico no es válido';
            break;
          default:
            errorMessage = error.message;
        }
        Alert.alert('Error', errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode='contain'
        />
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
      </View>

      <View style={styles.formContainer}>
        {!isSent ? (
          <>
            <Text style={styles.description}>
              No te preocupes, sabemos que le pasa hasta al mejor hacker.
              {'\n'}
              Solo escribe tu correo y te enviaremos un enlace para recuperarla.
            </Text>

            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
            <Input
              placeholder='Correo electrónico'
              value={email}
              onChangeText={setEmail}
              icon='mail'
              keyboardType='email-address'
            />

            <Button
              title='Enviar enlace de recuperación'
              onPress={handleSendResetLink}
              disabled={isLoading}
              variant='primary'
            />
          </>
        ) : (
          <>
            <View style={styles.successContainer}>
              <View style={styles.iconCircle}>
                <Feather name='check' size={32} color='#A3E4D7' />
              </View>
              <Text style={styles.successTitle}>¡Enlace enviado!</Text>
              <Text style={styles.successDescription}>
                Hemos enviado un enlace de recuperación a tu correo electrónico.
                Por favor revisa tu bandeja de entrada.
              </Text>
            </View>
          </>
        )}

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.divider} />
        </View>

        <Button
          title='Volver al inicio de sesión'
          onPress={() => navigation.navigate('Login')}
          variant='outline'
        />

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>¿Eres nuevo? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateAccount')}
          >
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
  backButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  errorText: {
    color: '#d95f80',
    marginBottom: 4,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'SpaceGroteskBold',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: 'SpaceGroteskRegular',
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFF',
  },
  dividerText: {
    color: '#FFF',
    paddingHorizontal: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: '#FFF',
    fontSize: 16,
  },
  signupLink: {
    color: '#FFF',
    fontSize: 16,
    textDecorationLine: 'underline',
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
