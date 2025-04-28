// screens/GoalsScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Feather } from "@expo/vector-icons";
import Header from "../components/Header";
import SavingsCard from "../components/SavingsCard";
import EditGoalsActionSheet from "../components/EditGoalsActionSheet";
import OtherGoalsCard from "../components/OtherGoalsCard";

const GoalsScreen = () => {
  const { currentUser } = useAuth();
  const email = currentUser?.email || "";
  const editSheetRef = useRef();
  const otherRef = useRef();

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return null;

  const openEditGoals = () => editSheetRef.current?.show();

  const onEdit = () => {
    Alert.alert("¡Éxito!", "Meta guardada exitosamente");
    otherRef.current?.reload();
  };
  const onAddNew = () => {
    Alert.alert("¡Éxito!", "Meta agregada exitosamente");
    otherRef.current?.reload();
  };
  const onCancel = () => {};

  return (
    <View style={styles.container}>
      <Header title="Metas de ahorro" />
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Metas de ahorro</Text>

        {/* Meta principal del mes */}
        <SavingsCard
          email={email}
          onViewAllPress={() => {}}
          showViewAll={false}
        />

        {/* Otras metas de ahorro */}
        <OtherGoalsCard ref={otherRef} email={email} />

        {/* Total y botón */}
        <TouchableOpacity
          style={styles.editGoalsButton}
          onPress={openEditGoals}
        >
          <Feather name="edit-2" size={18} color="#000" />
          <Text style={styles.editGoalsButtonText}>Editar metas de ahorro</Text>
        </TouchableOpacity>
      </ScrollView>

      <EditGoalsActionSheet
        ref={editSheetRef}
        onEdit={onEdit}
        onAddNew={onAddNew}
        onCancel={onCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#363E40" },
  content: { flex: 1, padding: 16 },
  pageTitle: {
    color: "#FFF",
    fontSize: 24,
    fontFamily: "SpaceGroteskBold",
    marginBottom: 16,
  },
  editGoalsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B6F2DC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 28,
  },
  editGoalsButtonText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "SpaceGroteskRegular",
  },
});

export default GoalsScreen;
