import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const ProgressCard = ({ onAddExpense, onAddIncome }) => {
  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
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
            Anota tus movimientos para <Text style={styles.bold}>visualizar aquí</Text> tus <Text style={styles.bold}>gráficas</Text> de control financiero. ¡Verás qué fácil es entender a dónde va tu dinero!
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={onAddExpense} activeOpacity={0.85}>
        <Feather name="plus" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.addButtonText}>
          Agregar <Text style={styles.expenseText}>gasto</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.addButton, styles.incomeButton]} 
        onPress={onAddIncome}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.addButtonText}>
          Agregar <Text style={styles.incomeText}>ingreso</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardCard: {
    backgroundColor: "#232728",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#D1D5DB",
    backgroundColor: 'transparent',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "SpaceGroteskBold",
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 6,
    fontFamily: "SpaceGroteskBold",
  },
  progressDescription: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "SpaceGroteskRegular",
  },
  bold: {
    color: '#FFFFFF',
    fontFamily: 'SpaceGroteskBold',
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: 'transparent',
    paddingVertical: 14,
    marginBottom: 14,
    marginTop: 0,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginLeft: 8,
    fontFamily: "SpaceGroteskRegular",
  },
  expenseText: {
    color: "#FF6B6B",
    fontFamily: "SpaceGroteskBold",
  },
  incomeButton: {
    marginBottom: 0,
  },
  incomeText: {
    color: "#4CD964",
    fontFamily: "SpaceGroteskBold",
  },
  icon: {
    marginLeft: 0,
  },
});

export default ProgressCard; 