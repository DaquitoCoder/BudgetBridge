import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import { Feather } from '@expo/vector-icons';

const CreateAccountScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} color="#A3E4D7" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Comienza a manejar tus finanzas de forma inteligente</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Input
            placeholder="Nombre completo"
            value={fullName}
            onChangeText={setFullName}
            icon="user"
          />
          
          <Input
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            icon="mail"
            keyboardType="email-address"
          />
          
          <Input
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock"
          />
          
          <Input
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="lock"
          />
          
          <TouchableOpacity 
            style={styles.termsContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <View style={styles.checkbox}>
              {acceptTerms && <Feather name="check" size={16} color="#A3E4D7" />}
            </View>
            <Text style={styles.termsText}>
              Acepto los <Text style={styles.termsLink}>Términos y Condiciones</Text> y la <Text style={styles.termsLink}>Política de Privacidad</Text>
            </Text>
          </TouchableOpacity>
          
          <Button 
            title="Crear cuenta" 
            onPress={() => navigation.navigate('Dashboard')} 
            variant="primary"
            disabled={!acceptTerms || !fullName || !email || !password || !confirmPassword}
          />
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.divider} />
          </View>
          
          <Button 
            title="Registrarse con Google" 
            onPress={() => {}} 
            variant="outline"
            icon="google"
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
    width: 60,
    height: 60,
    marginBottom: 16,
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
    marginBottom: 40,
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