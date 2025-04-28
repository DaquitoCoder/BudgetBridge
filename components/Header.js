import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();

  const openMenu = () => {
    // Aquí puedes implementar la lógica para abrir el menú lateral
    navigation.openDrawer();
  };

  const openNotifications = () => {
    // Navegar a la pantalla de notificaciones
    navigation.getParent("NotificationsDrawer").openDrawer();
  };

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });

  const goToDashboard = () => {
    navigation.navigate("DashboardDrawer", {
      screen: "DashboardScreen",
      params: { screen: 0 },
    });
  };

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={goToDashboard}>
          <Image
            source={require("../assets/logo_horizontal.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity onPress={openNotifications} style={styles.iconButton}>
          <Feather name="bell" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={openMenu} style={styles.iconButton}>
          <Feather name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#363E40",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    shadowColor: "#000",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 48,
    marginRight: 8,
  },
  appName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "SpaceGroteskRegular",
    width: 80,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default Header;
