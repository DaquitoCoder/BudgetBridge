import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";

const DashboardScreen = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
    setEmail(currentUser?.email || "");
  }, [loaded, error]);

  const handleLogout = () => {
    const auth = getAuth();
    setLoading(true);
    signOut(auth).catch((error) => {
      Alert.alert("Error", "No se pudo cerrar sesión");
      setLoading(false);
    });
  };

  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  const navigateToSettings = () => {
    navigation.navigate("Settings");
  };

  const navigateToAddGoal = () => {
    // Aquí navegarías a la pantalla de añadir meta
    Alert.alert("Acción", "Navegar a la pantalla de añadir meta");
  };

  const navigateToAllGoals = () => {
    // Aquí navegarías a la pantalla de todas las metas
    Alert.alert("Acción", "Navegar a la pantalla de todas las metas");
  };

  if (!loaded && !error) {
    return null;
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />

      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Mi tablero</Text>

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

        {/* Nueva sección de Metas de Ahorro */}
        <View style={styles.dashboardCard}>
          <Text style={styles.cardTitle}>
            Define tus metas de ahorro mensual
          </Text>

          <View style={styles.savingsContainer}>
            <View style={styles.savingsProgressBar}>
              <View style={styles.savingsProgressInner} />
            </View>

            <View style={styles.trophyContainer}>
              <FontAwesome5 name="trophy" size={24} color="#4CD964" />
            </View>
          </View>

          <View style={styles.savingsAmountContainer}>
            <Text style={styles.savingsAmount}>$0000</Text>
            <Text style={styles.savingsTotal}>/$8000</Text>
          </View>

          <Text style={styles.cardDescription}>
            Establece{" "}
            <Text style={styles.highlightText}>objetivos de ahorro</Text> para
            este mes y te ayudaremos a mantener el rumbo.{" "}
            <Text style={styles.highlightText}>¡Tú puedes!</Text>
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={navigateToAddGoal}
          >
            <Feather name="edit-2" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Agregar meta del mes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={navigateToAllGoals}
          >
            <Text style={styles.viewAllText}>Ver todas mis metas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#363E40",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 16,
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
  incomeButton: {
    backgroundColor: "#1E2429",
    marginBottom: 0,
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
  savingsContainer: {
    marginVertical: 24,
    alignItems: "center",
    position: "relative",
  },
  savingsProgressBar: {
    width: "100%",
    height: 12,
    backgroundColor: "#4A4A4A",
    borderRadius: 6,
  },
  savingsProgressInner: {
    width: "0%", // Ajustar según el progreso real
    height: "100%",
    backgroundColor: "#4CD964",
    borderRadius: 6,
  },
  trophyContainer: {
    position: "absolute",
    bottom: -12,
    backgroundColor: "#2A3038",
    borderRadius: 20,
    padding: 4,
  },
  savingsAmountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: 8,
  },
  savingsAmount: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "SpaceGroteskBold",
  },
  savingsTotal: {
    color: "#AAAAAA",
    fontSize: 18,
    fontFamily: "SpaceGroteskRegular",
  },
  viewAllButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
});

export default DashboardScreen;
