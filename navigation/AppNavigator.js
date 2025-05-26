import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useAuth } from "../contexts/AuthContext";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";

// Importar pantallas
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CreateAccountStep1Screen from "../screens/CreateAccountStep1Screen";
import CreateAccountStep2Screen from "../screens/CreateAccountStep2Screen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import SpendManagementScreen from "../screens/SpendManagementScreen";
import IncomeManagementScreen from "../screens/IncomeManagementScreen";
import CustomDrawer from "../components/CustomDrawer";
import GoalsScreen from "../screens/GoalsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SuggestionsScreen from "../screens/SuggestionsScreen";
import ProfileConfigScreen from "../screens/ProfileConfig";
import { NotificationProvider } from "../contexts/NotificationContext";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Navegación para usuarios no autenticados
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false, animation: "reveal_from_bottom" }}
      />
      {/* <Stack.Screen
        name='CreateAccount'
        component={CreateAccountScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      /> */}
      <Stack.Screen
        name="CreateAccountStep1"
        component={CreateAccountStep1Screen}
      />
      <Stack.Screen
        name="CreateAccountStep2"
        component={CreateAccountStep2Screen}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      {/* Agrega aquí otras pantallas públicas */}
    </Stack.Navigator>
  );
};

const NotificationsDrawer = () => (
  <Drawer.Navigator
    id="NotificationsDrawer"
    drawerContent={(props) => <NotificationsScreen {...props} />}
    screenOptions={{
      headerShown: false,
      drawerPosition: "right", // Menú izquierdo para notificaciones
      drawerStyle: {
        width: "80%",
        backgroundColor: "#363e40",
      },
    }}
  >
    <Drawer.Screen name="MainDrawer" component={MainDrawer} />
  </Drawer.Navigator>
);

// Navegación principal con drawer para usuarios autenticados
const MainDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#363e40",
          width: 280,
        },
        drawerLabelStyle: {
          color: "#FFFFFF",
          fontFamily: "SpaceGroteskRegular",
        },
        drawerActiveTintColor: "#d95f80",
        drawerInactiveTintColor: "#FFFFFF",
        drawerPosition: "right",
        drawerType: "slide",
      }}
    >
      <Drawer.Screen
        name="DashboardDrawer"
        component={MainStack}
        options={{ title: "Dashboard" }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileConfigScreen}
        options={{ title: "Perfil" }}
      />
      <Drawer.Screen
        name="SpendManagementScreen"
        component={SpendManagementStack}
        options={{ title: "Gestion de gastos" }}
      />
      <Drawer.Screen
        name="IncomeManagementScreen"
        component={IncomeManagementStack}
        options={{ title: "Gestion de ingresos" }}
      />
      <Drawer.Screen
        name="GoalsScreen"
        component={GoalsStack}
        options={{ title: "Metas de ahorro" }}
      />
      <Drawer.Screen
        name="SuggestionsScreen"
        component={SuggestionsStack}
        options={{ title: "Sugerencias" }}
      />
    </Drawer.Navigator>
  );
};

// Navegación para usuarios autenticados
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
};

const SpendManagementStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Gastos" component={SpendManagementScreen} />
  </Stack.Navigator>
);

const IncomeManagementStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Ingresos" component={IncomeManagementScreen} />
  </Stack.Navigator>
);

const GoalsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Goals" component={GoalsScreen} />
  </Stack.Navigator>
);

const SuggestionsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Suggestions" component={SuggestionsScreen} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NotificationProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#1E2429" />
        <NavigationContainer>
          {isAuthenticated ? <NotificationsDrawer /> : <AuthStack />}
        </NavigationContainer>
      </SafeAreaView>
    </NotificationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
