import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Feather } from "@expo/vector-icons";
import Header from "../components/Header";
import SavingsCard from "../components/SavingsCard";
import EditGoalsActionSheet from "../components/EditGoalsActionSheet";

const GoalsScreen = () => {
  const { currentUser } = useAuth();
  const email = currentUser?.email || "";
  const editSheetRef = useRef();

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  const goals = [
    {
      title: "Viaje a Japón",
      goalAmount: 15000000,
      savedAmount: 5000000,
      dateRange: "01/01/2025 - 31/12/2025",
      category: "Viajes",
    },
    {
      title: "Fondo de Emergencia",
      goalAmount: 3000,
      savedAmount: 1200,
      dateRange: "01/03/2025 - Continuo",
      category: "Seguridad Financiera",
    },
    {
      title: "Curso de Programación",
      goalAmount: 900,
      savedAmount: 1500,
      dateRange: "15/04/2025 - 30/06/2025",
      category: "Educación",
    },
    {
      title: "Nueva bicicleta",
      goalAmount: 1500000,
      savedAmount: 1100000,
      dateRange: "01/05/2025 - 31/10/2025",
      category: "Transporte",
    },
  ];

  // Abre el action sheet de metas
  const openEditGoals = () => editSheetRef.current?.show();

  const onEdit = () => {
    Alert.alert("Éxito", "¡Meta guardada exitosamente!");
  };
  const onAddNew = () => {
    Alert.alert("Éxito", "¡Meta guardada exitosamente!");
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
        <View style={styles.dashboardCard}>
          <Text style={styles.cardTitle}>Otras metas de ahorro</Text>
          {goals.map((goal, idx) => {
            const percent = Math.min(
              (goal.savedAmount / goal.goalAmount) * 100,
              100
            );
            return (
              <View key={idx} style={styles.goalItem}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <View style={styles.progressRow}>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[styles.progressBarFill, { width: `${percent}%` }]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>
                    ${goal.savedAmount.toLocaleString()} / $
                    {goal.goalAmount.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.goalDetails}>
                  Rango de tiempo: {goal.dateRange}
                </Text>
                <Text style={styles.goalDetails}>
                  Categoría: {goal.category}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Total de metas y botón de editar metas */}
        <Text style={styles.totalText}>Total de metas: {goals.length}</Text>
        <TouchableOpacity
          style={styles.editGoalsButton}
          onPress={openEditGoals}
        >
          <Feather name="edit-2" size={18} color="#000000" />
          <Text style={styles.editGoalsButtonText}>Editar metas de ahorro</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Action Sheet para editar metas */}
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
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "SpaceGroteskBold",
  },
  dashboardCard: {
    backgroundColor: "#2A3038",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    fontFamily: "SpaceGroteskBold",
  },
  goalItem: { marginBottom: 16 },
  goalTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SpaceGroteskBold",
    marginBottom: 4,
  },
  progressRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#4A4A4A",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 8,
  },
  progressBarFill: { height: "100%", backgroundColor: "#B6F2DC" },
  progressLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "SpaceGroteskRegular",
  },
  goalDetails: { color: "#AAAAAA", fontSize: 12, marginBottom: 4 },
  totalText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskBold",
    textAlign: "right",
    marginBottom: 8,
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
    color: "#000000",
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "SpaceGroteskRegular",
  },
});

export default GoalsScreen;
