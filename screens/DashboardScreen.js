import React, { useEffect, useRef } from "react";
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

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const email = currentUser?.email || "";
  const addSheetRef = useRef();

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
          onAddExpense={handleAddExpense}
          onAddIncome={handleAddIncome}
        />

        {/* Tarjeta de categorías */}
        <CategoryCard 
          categories={[
            { name: 'Gasto 01', amount: '$15.000', percentage: 100 },
            { name: 'Gasto 02', amount: '$10.000', percentage: 80 },
            { name: 'Gasto 03', amount: '$5.000', percentage: 70 },
            { name: 'Gasto 03', amount: '$5.000', percentage: 60 },
            { name: 'Gasto 03', amount: '$5.000', percentage: 50 }
          ]}
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
