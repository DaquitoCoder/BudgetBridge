import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

// Importar pantallas
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CreateAccountStep1Screen from '../screens/CreateAccountStep1Screen';
import CreateAccountStep2Screen from '../screens/CreateAccountStep2Screen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import CustomDrawer from '../components/CustomDrawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Navegación para usuarios no autenticados
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{ headerShown: false, animation: 'reveal_from_bottom' }}
      />
      {/* <Stack.Screen
        name='CreateAccount'
        component={CreateAccountScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      /> */}
      <Stack.Screen
        name='CreateAccountStep1'
        component={CreateAccountStep1Screen}
      />
      <Stack.Screen
        name='CreateAccountStep2'
        component={CreateAccountStep2Screen}
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

// Navegación principal con drawer para usuarios autenticados
const MainDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#363e40',
          width: 280,
        },
        drawerLabelStyle: {
          color: '#FFFFFF',
        },
        drawerActiveTintColor: '#d95f80',
        drawerInactiveTintColor: '#FFFFFF',
        drawerPosition: 'right',
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen
        name='DashboardScreen'
        component={MainStack}
        options={{ title: 'Dashboard' }}
      />
      <Drawer.Screen
        name='PruebaScreen'
        component={MainStack}
        options={{ title: 'Prueba' }}
      />
    </Drawer.Navigator>
  );
};

// Navegación para usuarios autenticados
const MainStack = () => {
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
      <NavigationContainer>
        {isAuthenticated ? <MainDrawer /> : <AuthStack />}
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
