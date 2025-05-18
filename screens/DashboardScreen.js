import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import SavingsCard from "../components/SavingsCard";
import CategoryCard from '../components/CategoryCard';
import ProgressCard from '../components/ProgressCard';
import AddSpendActionSheet from "../components/AddSpendActionSheet";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { Timestamp } from "firebase/firestore";

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const email = currentUser?.email || "";
  const addSheetRef = useRef();
  const [topCategories, setTopCategories] = useState([]);

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
    const fetchTopCategories = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const startTimestamp = Timestamp.fromDate(startOfMonth);
        const endTimestamp = Timestamp.fromDate(endOfMonth);

        const spendsRef = collection(db, "gestion_gasto");

        const q = query(
          spendsRef,
          where("usuario", "==", email),
          where("date", ">=", startTimestamp),
          where("date", "<=", endTimestamp)
        );

        const querySnapshot = await getDocs(q);
        const categoryTotals = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const cat = data.category || "Sin categoría";
          const amount = Number(data.amount) || 0;
          if (!categoryTotals[cat]) categoryTotals[cat] = 0;
          categoryTotals[cat] += amount;
        });
        const sorted = Object.entries(categoryTotals)
          .map(([name, amount]) => ({ name, amount }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5)
          .map((cat, idx) => ({
            ...cat,
            amount: cat.amount.toLocaleString('es-CO'),
            percentage: 100 - idx * 10
          }));

        setTopCategories(sorted);

      } catch (e) {
        console.error("Error al obtener categorías:", e);
        setTopCategories([]);
      }
    };

    if (email) fetchTopCategories();
  }, [email]);


  const navigateToAllGoals = () => {
    navigation.navigate("GoalsScreen", { email });
  };

  const handleAddExpense = () => {
    if (addSheetRef.current) {
      addSheetRef.current.show();
    }
  };

  const handleAddIncome = () => {
    // Implementar navegación o lógica para agregar ingreso
    console.log("Agregar ingreso");
  };

  const onAddNew = () => {
    // Aquí puedes agregar lógica adicional después de guardar un gasto
    console.log("Gasto agregado exitosamente");
  };

  const onCancel = () => {
    // Aquí puedes agregar lógica adicional si se cancela la operación
    console.log("Operación cancelada");
  };

  if (!loaded && !error) return null;

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />

      <ScrollView style={styles.content}>
        <Text style={[styles.pageTitle]}>Mi tablero</Text>

        {/* Tarjeta de progreso y gastos/ingresos */}
        <ProgressCard
          email={email}
          onAddExpense={handleAddExpense}
          onAddIncome={handleAddIncome}
        />

        {/* Tarjeta de categorías */}
        <CategoryCard
          categories={topCategories}
        />

        {/* Tarjeta de metas */}
        <SavingsCard email={email} onViewAllPress={navigateToAllGoals} />

      </ScrollView>

      <AddSpendActionSheet
        ref={addSheetRef}
        onAdd={onAddNew}
        onCancel={onCancel}
      />
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
    marginBottom: 16,
    fontFamily: "SpaceGroteskBold"
  },
});

export default DashboardScreen;
