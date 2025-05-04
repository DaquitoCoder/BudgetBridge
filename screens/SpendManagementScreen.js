import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import Header from "../components/Header";
import { useFonts } from "expo-font";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import AddSpendActionSheet from "../components/AddSpendActionSheet";
import FilterSpendsActionSheet from '../components/FilterSpendsActionSheet';


export default function SpendManagementScreen() {
  const { currentUser } = useAuth();
  const email = currentUser?.email || "";
  const [spends, setSpends] = useState([]);
  const addSheetRef  = useRef();
  const otherRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: null,
    minAmount: null,
    maxAmount: null
  });
  const filterSheetRef = useRef();

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES');
  };

  const [loaded, fontError] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    fetchSpends()
  }, [])

  const fetchSpends = async () => {
    try {
      setLoading(true);
      const spendsRef = collection(db, "gestion_gasto");
      let q = query(
        spendsRef, 
        where("usuario", "==", email), // Filtro por usuario
        orderBy("amount"),
        orderBy("date", "desc")
      );
      
      // Aplicar filtros dinámicos
      if (filters.category) {
        q = query(q, where("category", "==", filters.category));
      }
      if (filters.minAmount || filters.maxAmount) {
        // Aplica ambos filtros de monto juntos
        q = query(
          q,
          where("amount", ">=", filters.minAmount || 0),
          where("amount", "<=", filters.maxAmount || Infinity)
        );
      }

      const querySnapshot = await getDocs(q);
      const spendsData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        spendsData.push({
          id: doc.id,
          name: data.name,
          amount: data.amount,
          category: data.category,
          date: formatDate(data.date), // Formatear fecha
        });
      });
  
      setSpends(spendsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching spends:", err);
      setError("Error al cargar los gastos");
      Alert.alert("Error", "No se pudieron cargar los gastos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpends();
  }, [filters]);

  const onAddNew = () => {
    Alert.alert("¡Éxito!", "Gasto agregado exitosamente");
    fetchSpends(); // Recargar los gastos
  };
  
  const onCancel = () => {};

  const openAddSpend2 = () => {
    if (addSheetRef.current) {
      addSheetRef.current.show();
    }
  };

  const openAddSpend = () => {
    console.log("Botón presionado"); // Verifica si llega aquí
    if (addSheetRef.current) {
      console.log("Llamando a show()"); // Confirma que la referencia existe
      addSheetRef.current.show();
    } else {
      console.error("addSheetRef.current es undefined");
    }
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Calcular el total del mes
  const totalMonth = spends.reduce((sum, spends) => sum + spends.amount, 0)

  const formatCurrency = (amount) => {
    return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Header title="SpendManagement" />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Gestión de gastos</Text>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}
          onPress={() => filterSheetRef.current?.show()}>
            <Feather name="sliders" size={16} color="white" />
            <Text style={styles.filterText}>Filtrar por</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="sort-by-alpha" size={16} color="white" />
            <Text style={styles.filterText}>Ordenar por</Text>
          </TouchableOpacity>
        </View>

        {/* Spends List */}
        <View style={styles.dashboardCard}>
          <Text style={styles.sectionTitle}>Gastos recientes</Text>

          {loading ? (
            // Mostrar indicador de carga mientras se obtienen los datos
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando gastos...</Text>
            </View>
          ) : error ? (
            // Mostrar mensaje de error si hay un problema
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchSpends}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : spends.length === 0 ? (
            // Mostrar mensaje si no hay gastos
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay gastos registrados</Text>
            </View>
          ) : (
            // Mostrar la lista de gastos
            <ScrollView style={styles.spendsList}>
              {spends.map((item) => (
                <View key={item.id} style={styles.spendsItem}>
                  <View style={styles.spendsRow}>
                    <Text style={styles.spendsName}>{item.name}</Text>
                    <Text style={styles.spendsAmount}>{formatCurrency(item.amount)}</Text>
                  </View>
                  <View style={styles.spendsDetails}>
                    <Text style={styles.spendsCategory}>Categoría: {item.category}</Text>
                    <Text style={styles.spendsDate}>{item.date}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total del mes:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalMonth)}</Text>
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={openAddSpend}>
          <Feather name="plus" size={20} color="black" />
          <Text style={styles.addButtonText}>Agregar gasto</Text>
        </TouchableOpacity>
      </View>
      <AddSpendActionSheet 
      ref={addSheetRef} 
      onAdd={onAddNew} 
      onCancel={onCancel}/>
      <FilterSpendsActionSheet
      ref={filterSheetRef}
      currentFilters={filters}
      onApplyFilters={applyFilters}
      categories={['Comida', 'Transporte', 'Entretenimiento', 'Servicios']} // Personaliza según tus categorías
    />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#363E40",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(140, 227, 195, 0.2)",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "500",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A3038",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 8,
  },
  filterText: {
    color: "white",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    marginBottom: 12,
  },
  spendsList: {
    flex: 1,
  },
  spendsItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E1E",
    paddingBottom: 12,
    marginBottom: 12,
  },
  spendsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  spendsName: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  spendsAmount: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  spendsDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  spendsCategory: {
    color: "#9E9E9E",
    fontSize: 14,
  },
  spendsDate: {
    color: "#9E9E9E",
    fontSize: 14,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1E1E1E",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  totalAmount: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#8CE3C3",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 16,
    gap: 8,
  },
  addButtonText: {
    color: "black",
    fontWeight: "500",
    fontSize: 16,
  },
  dashboardCard: {
    backgroundColor: "#2A3038",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flex: 1,
  },
  // Nuevos estilos para estados de carga y error
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#2A3038",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#8CE3C3",
  },
  retryButtonText: {
    color: "#8CE3C3",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#9E9E9E",
    fontSize: 16,
    textAlign: "center",
  },
})
