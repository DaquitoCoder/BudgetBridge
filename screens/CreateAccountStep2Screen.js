import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Input from '../components/Input';
import Button from '../components/Button';

const CreateAccountStep2Screen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fullName, email, currency } = route.params;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    SpaceGroteskRegular: require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const validatePassword = (password) => {
    // Al menos 8 caracteres, una mayúscula, un número y un símbolo
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError('La contraseña no cumple con los requisitos');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Debes confirmar tu contraseña');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      return false;
    }

    setConfirmPasswordError('');
    return true;
  };

  const handleCreateAccount = async () => {
    // const isPasswordValid = validatePassword(password);
    // const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isPasswordValid = true;
    const isConfirmPasswordValid = true;

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const auth = getAuth();
      // Crear usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Actualizar el perfil con el nombre completo
      await updateProfile(user, {
        displayName: fullName,
      });

      // Guardar información adicional en Firestore
      // Aseguramos que currency sea un objeto plano antes de guardarlo
      const currencyData = {
        code: currency.code || '',
        name: currency.name || '',
        symbol: currency.symbol || '',
      };

      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        currency: currencyData, // Guardamos el objeto plano
        createdAt: new Date().toISOString(), // Convertimos a string para evitar problemas de serialización
      });

      // Navegar al Dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      console.error('Error al crear cuenta:', error);
      let errorMessage = 'Error al crear la cuenta';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este correo electrónico ya está en uso';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es demasiado débil';
          break;
        default:
          errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!loaded && !error) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode='contain'
        />
        <Text style={[styles.appName, { fontFamily: 'SpaceGroteskBold' }]}>
          Budget Bridge
        </Text>
      </View>

      <Text style={[styles.title, { fontFamily: 'SpaceGroteskBold' }]}>
        ¡Ahora, elige una buena contraseña!
      </Text>

      <Text style={[styles.subtitle, { fontFamily: 'SpaceGroteskRegular' }]}>
        Hazla segura, como una bóveda pero fácil de recordar:
      </Text>

      <View style={styles.requirementsContainer}>
        <View style={styles.requirementItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.requirementText}>Mínimo 8 caracteres</Text>
        </View>
        <View style={styles.requirementItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.requirementText}>Al menos una mayúscula</Text>
        </View>
        <View style={styles.requirementItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.requirementText}>Un número</Text>
        </View>
        <View style={styles.requirementItem}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.requirementText}>
            Y un símbolo para darle estilo
          </Text>
        </View>
      </View>

      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}
      <Input
        placeholder='Escribe tu contraseña'
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) validatePassword(text);
          if (confirmPassword && confirmPasswordError)
            validateConfirmPassword(confirmPassword);
        }}
        secureTextEntry
        icon='lock'
      />

      {confirmPasswordError ? (
        <Text style={styles.errorText}>{confirmPasswordError}</Text>
      ) : null}
      <Input
        placeholder='Confirma tu contraseña'
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (confirmPasswordError) validateConfirmPassword(text);
        }}
        secureTextEntry
        icon='lock'
      />

      <Button
        title='Crear cuenta'
        onPress={handleCreateAccount}
        variant='primary'
        style={styles.createButton}
        disabled={isLoading}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>o</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, { fontFamily: 'SpaceGroteskRegular' }]}>
          ¿Ya tienes cuenta?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text
            style={[styles.loginLink, { fontFamily: 'SpaceGroteskRegular' }]}
          >
            Iniciar sesión ahora
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2429',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  requirementsContainer: {
    marginBottom: 24,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletPoint: {
    color: '#FF6B6B',
    fontSize: 18,
    marginRight: 8,
  },
  requirementText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: '#d95f80',
    marginBottom: 4,
  },
  createButton: {
    marginTop: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#3A404A',
  },
  dividerText: {
    color: '#FFFFFF',
    paddingHorizontal: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  loginLink: {
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default CreateAccountStep2Screen;
