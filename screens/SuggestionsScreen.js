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

const SuggestionsScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

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
    // Simulación de carga de datos
    const fetchSuggestions = async () => {
      try {
        // Aquí iría la lógica para obtener sugerencias basadas en los datos del usuario
        // Por ahora usamos datos de ejemplo
        setTimeout(() => {
          setSuggestions([
            {
              id: 1,
              type: "ahorro",
              title: "Optimiza tus ahorros",
              description: "Podrías ahorrar un 15% más si reduces tus gastos en entretenimiento.",
              action: "Ver detalles",
              icon: "dollar-sign",
              color: "#B6F2DC",
            },
            {
              id: 2,
              type: "gasto",
              title: "Controla tus gastos recurrentes",
              description: "Has gastado $120,000 en suscripciones este mes. Considera cancelar las que no uses.",
              action: "Revisar suscripciones",
              icon: "credit-card",
              color: "#D95F80",
            },
            {
              id: 3,
              type: "inversión",
              title: "Oportunidad de inversión",
              description: "Con tus ahorros actuales podrías invertir en un fondo con rendimiento del 8% anual.",
              action: "Explorar opciones",
              icon: "trending-up",
              color: "#7AB6DA",
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

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