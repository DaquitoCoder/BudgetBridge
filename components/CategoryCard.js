import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const CategoryCard = ({ categories }) => {
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
      <Text style={styles.cardTitle}>
        Tus gastos organizados por categoría
      </Text>
      <Text style={styles.cardDescription}>
        Aquí verás{" "}
        <Text style={styles.highlightText}>cuánto has gastado</Text> en cada{" "}
        <Text style={styles.highlightText}>categoría</Text>. ¡Una forma
        clara de detectar en qué se te va más el dinero!
      </Text>

      {categories && categories.length > 0 ? (
        categories.map((category, index) => (
          <View 
            key={index} 
            style={[
              styles.categoryItem, 
              index % 2 === 0 ? styles.categoryGreen : styles.categoryPink,
              { width: `${category.percentage}%` }
            ]}
          >
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryAmount}>{category.amount}</Text>
          </View>
        ))
      ) : (
        <View style={[styles.categoryItem, styles.categoryGreen, { width: "100%" }]}>
          <Text style={styles.categoryName}>No hay gastos registrados</Text>
          <Text style={styles.categoryAmount}>$0</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardCard: {
    backgroundColor: "#232728",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 8,
    fontFamily: "SpaceGroteskBold",
  },
  cardDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: "SpaceGroteskRegular",
  },
  highlightText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontFamily: "SpaceGroteskBold",
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
    backgroundColor: "#B6F2DC",
  },
  categoryPink: {
    backgroundColor: "#E78DA5",
  },
  categoryName: {
    color: "#000",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
  categoryAmount: {
    color: "#000",
    fontSize: 16,
    
    fontFamily: "SpaceGroteskBold",
  },
});

export default CategoryCard; 