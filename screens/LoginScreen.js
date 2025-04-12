import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

import Input from '../components/Input';
import Button from '../components/Button';
import * as SplashScreen from 'expo-splash-screen';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();
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

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode='contain'
        />
        <Text style={[styles.welcomeText, { fontFamily: 'SpaceGroteskBold' }]}>
          ¡Bienvenid@!
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          placeholder='Escribe tu nombre de usuario'
          value={username}
          onChangeText={setUsername}
          icon='user'
        />

        <Input
          placeholder='Escribe tu contraseña'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon='lock'
        />

        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={[styles.forgotPasswordText, { fontFamily: 'SpaceGroteskRegular' }]}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <Button
          title='Iniciar sesión'
          onPress={() => navigation.navigate('Dashboard')}
          variant='primary'
        />

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.divider} />
        </View>

        <Button
          title='Iniciar sesión con Google'
          onPress={() => {}}
          variant='outline'
          icon='google'
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
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 32,
  },
  formContainer: {
    flex: 1,
  },
  forgotPasswordContainer: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#FFF',
    textDecorationLine: 'underline',
    fontSize: 16,
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
    textDecorationLine: 'underline'
  },
});

export default LoginScreen;
