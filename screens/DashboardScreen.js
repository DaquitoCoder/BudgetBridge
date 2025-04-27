// screens/DashboardScreen.js

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import SavingsCard from "../components/SavingsCard";

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const email = currentUser?.email || "";

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const navigateToAllGoals = () => {
    navigation.navigate("GoalsScreen", { email });
  };

  if (!loaded && !error) return null;

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />

      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Mi tablero</Text>

        {/* Tarjeta de ingresos/gastos */}
        <View style={styles.dashboardCard}>
          <View style={styles.progressContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>0%</Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>
                ¡Empieza a registrar tus ingresos y gastos!
              </Text>
              <Text style={styles.progressDescription}>
                Anota tus movimientos para visualizar aquí tus{" "}
                <Text style={styles.highlightText}>gráficas</Text> de control
                financiero. ¡Verás qué fácil es entender a dónde va tu dinero!
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.addButton}>
            <Feather name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>
              Agregar <Text style={styles.expenseText}>gasto</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.addButton, styles.incomeButton]}>
            <Feather name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>
              Agregar <Text style={styles.incomeText}>ingreso</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tarjeta de categorías */}
        <View style={styles.dashboardCard}>
          <Text style={styles.cardTitle}>
            Tus gastos organizados por categoría
          </Text>
          <Text style={styles.cardDescription}>
            Aquí verás{" "}
            <Text style={styles.highlightText}>cuánto has gastado</Text> en cada{" "}
            <Text style={styles.highlightText}>categoría</Text>. ¡Una forma
            clara de detectar en qué se te va más el dinero!
          </Text>

          <View style={[styles.categoryItem, styles.categoryGreen]}>
            <Text style={styles.categoryName}>Gasto 01</Text>
            <Text style={styles.categoryAmount}>$15.000</Text>
          </View>

          <View style={[styles.categoryItem, styles.categoryPink]}>
            <Text style={styles.categoryName}>Gasto 02</Text>
            <Text style={styles.categoryAmount}>$10.000</Text>
          </View>

          <View style={[styles.categoryItem, styles.categoryGreen]}>
            <Text style={styles.categoryName}>Gasto 03</Text>
            <Text style={styles.categoryAmount}>$5.000</Text>
          </View>
        </View>

        {/* Tarjeta de metas */}
        <SavingsCard email={email} onViewAllPress={navigateToAllGoals} />
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
    marginBottom: 16,
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
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SpaceGroteskBold",
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: "SpaceGroteskBold",
  },
  progressDescription: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "SpaceGroteskRegular",
  },
  highlightText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: "SpaceGroteskBold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E2429",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "SpaceGroteskRegular",
  },
  expenseText: {
    color: "#FF6B6B",
    fontFamily: "SpaceGroteskBold",
  },
  incomeButton: {
    backgroundColor: "#1E2429",
    marginBottom: 0,
  },
  incomeText: {
    color: "#4CD964",
    fontFamily: "SpaceGroteskBold",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "SpaceGroteskBold",
  },
  cardDescription: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: "SpaceGroteskRegular",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryGreen: {
    backgroundColor: "rgba(76, 217, 100, 0.2)",
  },
  categoryPink: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
  },
  categoryName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
  categoryAmount: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SpaceGroteskBold",
  },
});

export default DashboardScreen;
