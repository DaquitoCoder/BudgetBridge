import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Feather } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import CurrencyPicker from '../components/CurrencyPicker';

const CreateAccountStep1Screen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: 'COP',
    name: 'Peso Colombiano',
    symbol: '$',
  });
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    SpaceGroteskRegular: require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const validateName = (name) => {
    if (!name.trim()) {
      setNameError('El nombre es obligatorio');
      return false;
    } else if (name.trim().length < 3) {
      setNameError('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    setNameError('');
    return true;
  };

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

  const handleContinue = () => {
    const isNameValid = validateName(fullName);
    const isEmailValid = validateEmail(email);

    if (isNameValid && isEmailValid) {
      // Navegar al paso 2 con los datos del paso 1
      navigation.navigate('CreateAccountStep2', {
        fullName,
        email,
        currency: selectedCurrency,
      });
    }
  };

  const toggleCurrencyPicker = () => {
    setShowCurrencyPicker(!showCurrencyPicker);
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
        ¡Crea tu cuenta y empieza a tomar control de tus finanzas!
      </Text>

      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      <Input
        placeholder='Escribe tu nombre completo'
        value={fullName}
        onChangeText={(text) => {
          setFullName(text);
          if (nameError) validateName(text);
        }}
        icon='user'
      />

      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <Input
        placeholder='Escribe tu correo electrónico'
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) validateEmail(text);
        }}
        icon='mail'
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <Text style={[styles.label, { fontFamily: 'SpaceGroteskRegular' }]}>
        Elige tu moneda preferida
      </Text>
      <TouchableOpacity
        style={styles.currencySelector}
        onPress={toggleCurrencyPicker}
      >
        <Text style={styles.currencyText}>
          {selectedCurrency.code} - {selectedCurrency.name}
        </Text>
        <Feather name='chevron-right' size={20} color='#FFFFFF' />
      </TouchableOpacity>

      {showCurrencyPicker && (
        <CurrencyPicker
          onSelect={(currency) => {
            setSelectedCurrency(currency);
            setShowCurrencyPicker(false);
          }}
          onClose={() => setShowCurrencyPicker(false)}
        />
      )}

      <Button
        title='Continuar'
        onPress={handleContinue}
        variant='primary'
        style={styles.continueButton}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>o</Text>
        <View style={styles.divider} />
      </View>

      <Button
        title='Registrarme con Google'
        onPress={() => {}}
        variant='outline'
        icon='google'
      />

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
    marginBottom: 30,
  },
  errorText: {
    color: '#d95f80',
    marginBottom: 4,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A3038',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  currencyText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  continueButton: {
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
    marginTop: 24,
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

export default CreateAccountStep1Screen;
