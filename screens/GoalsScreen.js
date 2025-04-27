import React, { useState, useEffect } from "react";
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
import Header from "../components/Header"; // Importa el Header

const GoalsScreen = () => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || "");

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

  return (
    <View style={styles.container}>
      <Header title="Metas de ahorro" />
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Metas de ahorro</Text>

        <View style={styles.dashboardCard}>
          <Text style={styles.cardTitle}>Meta principal del mes</Text>
          <View style={styles.goalContainer}>
            <Text style={styles.goalText}>$5.000 / $20.000</Text>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={18} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Editar meta del mes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dashboardCard}>
          <Text style={styles.cardTitle}>Otras metas de ahorro</Text>
          {goals.map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalAmount}>
                ${goal.savedAmount} / ${goal.goalAmount}
              </Text>
              <Text style={styles.goalDetails}>
                Rango de tiempo: {goal.dateRange}
              </Text>
              <Text style={styles.goalDetails}>Categoría: {goal.category}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addGoalButton}
          onPress={() =>
            Alert.alert("Agregar meta", "Navegar a la pantalla de agregar meta")
          }
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.addGoalButtonText}>Agregar meta de ahorro</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#363E40",
  },
  content: {
    flex: 1,
    padding: 16,
  },
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
    marginBottom: 8,
    fontFamily: "SpaceGroteskBold",
  },
  goalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    padding: 8,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 8,
  },
  goalItem: {
    marginBottom: 12,
  },
  goalTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  goalAmount: {
    color: "#FFFFFF",
    fontSize: 14,
    marginVertical: 4,
  },
  goalDetails: {
    color: "#AAAAAA",
    fontSize: 12,
  },
  addGoalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E2429",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  addGoalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default GoalsScreen;
