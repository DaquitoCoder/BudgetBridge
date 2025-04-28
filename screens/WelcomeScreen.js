// screens/WelcomeScreen.tsx
import { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../components/Button";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
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
    <View style={[styles.background]}>
      <LinearGradient
        colors={["#D95F80", "#363E40", "#363E40", "#75A3BF"]}
        locations={[0.0566, 0.3553, 0.6867, 0.9901]}
        start={[1, 0]}
        end={[0, 1]}
        style={styles.background}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.contentContainer}>
            <Text
              style={[
                styles.welcomeText,
                { fontFamily: "SpaceGroteskRegular" },
              ]}
            >
              ¡Aprende a manejar tus finanzas de forma sencilla!
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Continuar"
              onPress={() => navigation.navigate("Login")}
              variant="primary"
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#1E2429",
    flex: 1,
  },
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: "70%",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  appName: {
    color: "#FFFFFF",
    fontSize: 32,
  },
  contentContainer: {
    alignItems: "center",
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 32,
    textAlign: "center",
    // lineHeight: 26,
  },
  buttonContainer: {
    marginBottom: 40,
  },
});

export default WelcomeScreen;
