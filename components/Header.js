import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

const Header = () => {
  const { refreshNotifications } = useNotification();
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    checkNotifications();
  }, [refreshNotifications]);

  const checkNotifications = async () => {
    try {
      // 🔴 Verificar notificaciones en Firestore
      const q = query(
        collection(db, "notificaciones"),
        where("usuario", "==", currentUser.email),
        where("estado", "==", true)
      );
      const snapshot = await getDocs(q);
      const hasUnread = snapshot.docs.length > 0;

      // 🔴 Verificar sugerencia diaria local
      const today = new Date().toISOString().split("T")[0];
      const seenKey = `suggestion_seen_${today}`;
      const seen = await AsyncStorage.getItem(seenKey);
      const hasSuggestion = seen !== "true";

      // 🔴 Mostrar punto si hay algo pendiente
      setShowDot(hasUnread || hasSuggestion);
    } catch (err) {
      console.error("Error verificando notificaciones:", err);
    }
  };

  const openMenu = () => {
    navigation.openDrawer();
  };

  const openNotifications = async () => {
    // Marcar sugerencia como leída
    const today = new Date().toISOString().split("T")[0];
    const seenKey = `suggestion_seen_${today}`;
    await AsyncStorage.setItem(seenKey, "true");

    // Ir a la pantalla de notificaciones
    navigation.getParent("NotificationsDrawer").openDrawer();

    // Ocultar el punto rojo
    setShowDot(false);
  };

  const goToDashboard = () => {
    navigation.navigate("DashboardDrawer", {
      screen: "DashboardScreen",
      params: { screen: 0 },
    });
  };

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
          {showDot && <View style={styles.redDot} />}
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
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: "relative",
  },
  redDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
});

export default Header;
