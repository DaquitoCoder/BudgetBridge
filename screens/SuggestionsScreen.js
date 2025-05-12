import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Header from "../components/Header";
import { analyzeSpending, analyzeSavings } from "../components/FinancialAnalysis";

const SuggestionsScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);


  useEffect(() => {
    const generateSuggestions = async () => {
      setLoading(true);
      
      try {
        // 1. Analizar gastos
        const spendingAnalysis = await analyzeSpending(currentUser.email);
        
        // 2. Analizar ahorros
        const savingsAnalysis = await analyzeSavings(currentUser.email);
        
        // 3. Generar sugerencias basadas en el análisis
        const generatedSuggestions = [];
        
        // Sugerencias basadas en gastos
        if (spendingAnalysis.success) {
          const { categoryAnalysis, monthlyComparison, spendingPatterns } = spendingAnalysis.data;
          
          // Sugerencia 1: Categoría con mayor gasto
          if (categoryAnalysis.highestSpendingCategory) {
            generatedSuggestions.push({
              id: 1,
              type: "gasto",
              title: `Tu mayor gasto es en ${categoryAnalysis.highestSpendingCategory.category}`,
              description: `El ${categoryAnalysis.highestSpendingCategory.percentage}% de tus gastos son en esta categoría. ¿Quieres revisar tus hábitos?`,
              action: "Ver gastos",
              icon: "alert-triangle",
              color: "#D95F80",
            });
          }
          
          // Sugerencia 2: Comparación mensual
          if (monthlyComparison.variation) {
            const trend = monthlyComparison.variation > 0 ? "aumentado" : "disminuido";
            generatedSuggestions.push({
              id: 2,
              type: "tendencia",
              title: `Tus gastos han ${trend} un ${Math.abs(monthlyComparison.variation)}%`,
              description: `Comparado con el mes anterior, has ${trend} tus gastos. ${monthlyComparison.variation > 0 ? "¿Quieres establecer un presupuesto?" : "¡Buen trabajo!"}`,
              action: "Ver análisis",
              icon: monthlyComparison.variation > 0 ? "trending-up" : "trending-down",
              color: monthlyComparison.variation > 0 ? "#D95F80" : "#4CD964",
            });
          }
          
          // Sugerencia 3: Patrón de gasto
          if (spendingPatterns.maxDay) {
            generatedSuggestions.push({
              id: 3,
              type: "patrón",
              title: `Gastas más los ${spendingPatterns.maxDay}`,
              description: `Tus gastos son más altos a principios/mitad/fin de semana. ¿Quieres programar recordatorios?`,
              action: "Ver patrones",
              icon: "calendar",
              color: "#7AB6DA",
            });
          }
        }
        
        // Sugerencias basadas en ahorros
        if (savingsAnalysis.success) {
          const { goalsProgress, savingsGaps } = savingsAnalysis.data;
          
          // Sugerencia 4: Progreso de metas
          if (goalsProgress.length > 0) {
            const closestGoal = goalsProgress[0];
            if (closestGoal.progressPercentage < 100) {
              generatedSuggestions.push({
                id: 4,
                type: "ahorro",
                title: `Meta "${closestGoal.name}" al ${closestGoal.progressPercentage}%`,
                description: `Te faltan $${closestGoal.targetAmount - closestGoal.currentAmount} para alcanzar tu meta. ${closestGoal.daysRemaining > 0 ? `Necesitas ahorrar $${closestGoal.dailySavingsNeeded} por día.` : '¡La fecha límite es hoy!'}`,
                action: "Ver metas",
                icon: "target",
                color: "#B6F2DC",
              });
            }
          }
          
          // Sugerencia 5: Brechas de ahorro
          if (savingsGaps.length > 0) {
            const largestGap = savingsGaps[0];
            generatedSuggestions.push({
              id: 5,
              type: "ahorro",
              title: "Brecha en tus ahorros",
              description: `Para alcanzar tu meta "${largestGap.goalName}", necesitas ahorrar $${largestGap.dailySavingsNeeded} diarios. ¿Quieres ajustar tu presupuesto?`,
              action: "Ajustar metas",
              icon: "bar-chart-2",
              color: "#FFA500",
            });
          }
        }
        
        setSuggestions(generatedSuggestions);
        
      } catch (error) {
        console.error("Error generating suggestions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    generateSuggestions();
  }, [currentUser.email]);

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

  const handleSuggestionAction = (suggestion) => {
    // Navegar a la pantalla correspondiente según el tipo de sugerencia
    switch(suggestion.type) {
      case "ahorro":
        navigation.navigate("GoalsScreen");
        break;
      case "gasto":
        navigation.navigate("SpendManagementScreen");
        break;
      case "inversión":
        // navigation.navigate("InvestmentScreen");
        Alert.alert("Próximamente", "Esta funcionalidad estará disponible pronto");
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Sugerencias" />
      
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Sugerencias financieras</Text>
        <Text style={styles.subtitle}>Recomendaciones personalizadas para mejorar tus finanzas</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#B6F2DC" style={styles.loader} />
        ) : suggestions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="alert-circle" size={48} color="#8E9A9D" />
            <Text style={styles.emptyText}>No hay sugerencias disponibles</Text>
            <Text style={styles.emptySubtext}>Registra más movimientos para recibir recomendaciones personalizadas</Text>
          </View>
        ) : (
          suggestions.map((suggestion) => (
            <View 
              key={suggestion.id} 
              style={[styles.suggestionCard, { borderLeftColor: suggestion.color }]}
            >
              <View style={styles.suggestionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${suggestion.color}20` }]}>
                  <Feather name={suggestion.icon} size={20} color={suggestion.color} />
                </View>
                <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
              </View>
              
              <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleSuggestionAction(suggestion)}
              >
                <Text style={[styles.actionText, { color: suggestion.color }]}>{suggestion.action}</Text>
                <Feather name="arrow-right" size={16} color={suggestion.color} />
              </TouchableOpacity>
            </View>
          ))
        )}
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
    fontFamily: "SpaceGroteskBold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#8E9A9D",
    fontSize: 14,
    fontFamily: "SpaceGroteskRegular",
    marginBottom: 24,
  },
  suggestionCard: {
    backgroundColor: "#2A3038",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  suggestionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "SpaceGroteskBold",
  },
  suggestionDescription: {
    color: "#AAAAAA",
    fontSize: 14,
    fontFamily: "SpaceGroteskRegular",
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  actionText: {
    fontSize: 14,
    fontFamily: "SpaceGroteskRegular",
    marginRight: 8,
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "SpaceGroteskBold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    color: "#8E9A9D",
    fontSize: 14,
    fontFamily: "SpaceGroteskRegular",
    textAlign: "center",
  },
});

export default SuggestionsScreen;