import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

// Importar pantallas
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createStackNavigator();

// Navegación para usuarios no autenticados
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{ headerShown: false, animation: 'reveal_from_bottom' }}
      />
      <Stack.Screen
        name='CreateAccount'
        component={CreateAccountScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name='ForgotPassword'
        component={ForgotPasswordScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      {/* Agrega aquí otras pantallas públicas */}
    </Stack.Navigator>
  );
};

// Navegación para usuarios autenticados
const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='Dashboard'
        component={DashboardScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      {/* Agrega aquí otras pantallas protegidas */}
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#1E2429' />
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
      <NavigationContainer>
        {isAuthenticated ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
