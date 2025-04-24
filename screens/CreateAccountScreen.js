import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import { Feather } from '@expo/vector-icons';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

const CreateAccountScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para errores de validación
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Validación del nombre
  const validateName = (name) => {
    if (!fullName.trim()) {
      setNameError('El nombre es obligatorio');
      return false;
    }
    setNameError('');
    return true;
  };

  // Validación de email
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

  // Validación de contraseña
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      return false;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Validación de confirmación de contraseña
  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Por favor confirma tu contraseña');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleRegister = () => {
    // Validar todos los campos
    const isNameValid = validateName(fullName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (
      !isNameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      return;
    }

    setIsLoading(true);
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;

        // Actualizar el perfil del usuario con el nombre
        await updateProfile(user, {
          displayName: fullName,
        });
        
      })
      .catch((error) => {
        // Traducción de errores comunes de Firebase para una mejor UX
        let errorMessage;
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Este correo electrónico ya está en uso';
            break;
          case 'auth/invalid-email':
            errorMessage = 'El formato del correo electrónico no es válido';
            break;
          case 'auth/weak-password':
            errorMessage = 'La contraseña es demasiado débil';
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode='contain'
          />
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Comienza a manejar tus finanzas de forma inteligente
          </Text>
        </View>

        <View style={styles.formContainer}>
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          <Input
            placeholder='Nombre completo'
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (nameError) validateName(text);
            }}
            icon='user'
          />

          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <Input
            placeholder='Correo electrónico'
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) validateEmail(text);
            }}
            icon='mail'
            keyboardType='email-address'
          />

          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <Input
            placeholder='Contraseña'
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) validatePassword(text);
              if (confirmPassword && confirmPasswordError) {
                validateConfirmPassword(confirmPassword);
              }
            }}
            secureTextEntry
            icon='lock'
          />

          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}

          <Input
            placeholder='Confirmar contraseña'
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) validateConfirmPassword(text);
            }}
            secureTextEntry
            icon='lock'
          />

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <View style={styles.checkbox}>
              {acceptTerms && (
                <Feather name='check' size={16} color='#A3E4D7' />
              )}
            </View>
            <Text style={styles.termsText}>
              Acepto los{' '}
              <Text style={styles.termsLink}>Términos y Condiciones</Text> y la{' '}
              <Text style={styles.termsLink}>Política de Privacidad</Text>
            </Text>
          </TouchableOpacity>

          <Button
            title={isLoading ? 'Cargando...' : 'Crear cuenta'}
            onPress={handleRegister}
            variant='primary'
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.divider} />
          </View>

          <Button
            title='Registrarse con Google'
            onPress={() => {}}
            variant='outline'
            icon='google'
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    marginTop: 10,
    marginBottom: 30,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#A0A0A0',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A3E4D7',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    color: '#A0A0A0',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: '#A3E4D7',
    textDecorationLine: 'underline',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  loginLink: {
    color: '#A3E4D7',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CreateAccountScreen;
