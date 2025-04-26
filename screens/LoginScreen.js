import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import Input from "../components/Input";
import Button from "../components/Button";
import * as SplashScreen from "expo-splash-screen";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setInitializing(false);
    });

    // Limpiar el listener cuando el componente se desmonte
    return unsubscribe;
  }, []);

  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("El correo electrónico es obligatorio");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Introduce un correo electrónico válido");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validación de contraseña
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      return false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = () => {
    // Validar los campos antes de proceder
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {})
      .catch((error) => {
        let errorMessage;
        switch (error.code) {
          case "auth/invalid-credential":
            errorMessage = "Credenciales de inicio de sesión inválidas";
            break;
          case "auth/internal-error":
            errorMessage = "Error interno del servidor";
            break;
          case "auth/too-many-requests":
            errorMessage = "Demasiados intentos fallidos. Inténtalo más tarde";
            break;
          default:
            errorMessage = error.message;
        }
        Alert.alert("Error", errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!loaded && !error) {
    return null;
  }

  if (initializing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.welcomeText, { fontFamily: "SpaceGroteskBold" }]}>
          ¡Bienvenid@!
        </Text>
      </View>

      <View style={styles.formContainer}>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Input
          placeholder="Escribe tu correo electrónico"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) validateEmail(text);
          }}
          icon="user"
        />

        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <Input
          placeholder="Escribe tu contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) validatePassword(text);
          }}
          secureTextEntry
          icon="lock"
        />

        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text
            style={[
              styles.forgotPasswordText,
              { fontFamily: "SpaceGroteskRegular" },
            ]}
          >
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <Button
          title="Iniciar sesión"
          onPress={handleLogin}
          variant="primary"
          disabled={isLoading}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.divider} />
        </View>

        <Button
          title="Iniciar sesión con Google"
          onPress={() => {}}
          variant="outline"
          icon="google"
        />

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>¿Eres nuevo? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateAccountStep1")}
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
    backgroundColor: "#1E2429",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 32,
  },
  formContainer: {
    flex: 1,
  },
  forgotPasswordContainer: {
    alignSelf: "center",
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: "#FFF",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  errorText: {
    color: "#d95f80",
    marginBottom: 4,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#FFF",
  },
  dividerText: {
    color: "#FFF",
    paddingHorizontal: 16,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    color: "#FFF",
    fontSize: 16,
  },
  signupLink: {
    color: "#FFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
