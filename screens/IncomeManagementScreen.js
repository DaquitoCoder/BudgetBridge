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
import AddIncomeActionSheet from "../components/AddIncomeActionSheet";
import FilterIncomesActionSheet from '../components/FilterIncomesActionSheet';
import SortIncomesActionSheet from '../components/SortIncomesActionSheet';

export default function IncomeManagementScreen() {
  const { currentUser } = useAuth();
  const email = currentUser?.email || "";
  const [incomes, setIncomes] = useState([]);
  const addSheetRef = useRef();
  const otherRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: null,
    minAmount: null,
    maxAmount: null
  });
  const filterSheetRef = useRef();
  const [sortOrder, setSortOrder] = useState({
    field: 'date',
    direction: 'desc'
  });
  const sortSheetRef = useRef();

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
    fetchIncomes()
  }, [])

  useEffect(() => {
    const initialFilters = {
      category: null,
      minAmount: null,
      maxAmount: null
    };
    setFilters(initialFilters);
  }, [])

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const incomesRef = collection(db, "gestion_ingreso");
      let q = query(
        incomesRef,
        where("usuario", "==", email)
      );

      const querySnapshot = await getDocs(q);
      let incomesData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        incomesData.push({
          id: doc.id,
          name: data.name,
          amount: data.amount,
          category: data.category,
          date: formatDate(data.date),
          rawName: data.name.toLowerCase(),
          rawDate: data.date
        });
      });

      // Aplicar filtros
      if (filters.category) {
        incomesData = incomesData.filter(item => item.category === filters.category);
      }
      if (filters.minAmount) {
        incomesData = incomesData.filter(item => item.amount >= filters.minAmount);
      }
      if (filters.maxAmount) {
        incomesData = incomesData.filter(item => item.amount <= filters.maxAmount);
      }

      // Aplicar ordenamiento
      incomesData.sort((a, b) => {
        if (sortOrder.field === 'date') {
          return sortOrder.direction === 'desc'
            ? b.rawDate - a.rawDate
            : a.rawDate - b.rawDate;
        } else {
          const comparison = a.rawName.localeCompare(b.rawName);
          return sortOrder.direction === 'desc' ? -comparison : comparison;
        }
      });

      setIncomes(incomesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching incomes:", err);
      setError("Error al cargar los ingresos");
      Alert.alert("Error", "No se pudieron cargar los ingresos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [sortOrder, filters]);

  const onAddNew = () => {
    fetchIncomes();
    
    const resetFilters = {
      category: null,
      minAmount: null,
      maxAmount: null
    };
    setFilters(resetFilters);
  };

  const onCancel = () => { };

  const openAddIncome = () => {
    if (addSheetRef.current) {
      addSheetRef.current.show();
    }
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const applySort = (newSort) => {
    setSortOrder(newSort);
  };

  // Calcular el total del mes
  const totalMonth = incomes.reduce((sum, income) => sum + income.amount, 0)

  const formatCurrency = (amount) => {
    return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Header title="IncomeManagement" />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Gestión de ingresos</Text>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}
            onPress={() => filterSheetRef.current?.show()}>
            <Feather name="sliders" size={16} color="white" />
            <Text style={styles.filterText}>Filtrar por</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              sortOrder.field === 'date' && styles.activeSortButton
            ]}
            onPress={() => sortSheetRef.current?.show()}
          >
            <MaterialIcons name="sort-by-alpha" size={16} color="white" />
            <Text style={styles.filterText}>{sortOrder.field === 'date' ? 'Por fecha' : 'Por nombre'}</Text>
            <Feather
              name={sortOrder.direction === 'desc' ? 'arrow-down' : 'arrow-up'}
              size={16}
              color="#8CE3C3"
              style={styles.sortIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Incomes List */}
        <View style={styles.dashboardCard}>
          <Text style={styles.sectionTitle}>Ingresos recientes</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando ingresos...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchIncomes}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : incomes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay ingresos registrados</Text>
            </View>
          ) : (
            <ScrollView style={styles.incomesList}>
              {incomes.map((item) => (
                <View key={item.id} style={styles.incomesItem}>
                  <View style={styles.incomesRow}>
                    <Text style={styles.incomesName}>{item.name}</Text>
                    <Text style={styles.incomesAmount}>{formatCurrency(item.amount)}</Text>
                  </View>
                  <View style={styles.incomesDetails}>
                    <Text style={styles.incomesCategory}>Categoría: {item.category}</Text>
                    <Text style={styles.incomesDate}>{item.date}</Text>
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
        <TouchableOpacity style={styles.addButton} onPress={openAddIncome}>
          <Feather name="plus" size={20} color="black" />
          <Text style={styles.addButtonText}>Agregar ingreso</Text>
        </TouchableOpacity>
      </View>
      <AddIncomeActionSheet
        ref={addSheetRef}
        onAdd={onAddNew}
        onCancel={onCancel} />
      <FilterIncomesActionSheet
        ref={filterSheetRef}
        currentFilters={filters}
        onApplyFilters={applyFilters}
        categories={['Salario', 'Freelance', 'Inversiones', 'Negocios', 'Alquileres', 
          'Ventas', 'Regalos', 'Reembolsos', 'Otros']}
      />
      <SortIncomesActionSheet
        ref={sortSheetRef}
        currentSort={sortOrder}
        onApplySort={applySort}
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
  incomesList: {
    flex: 1,
  },
  incomesItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E1E",
    paddingBottom: 12,
    marginBottom: 12,
  },
  incomesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  incomesName: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  incomesAmount: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  incomesDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  incomesCategory: {
    color: "#9E9E9E",
    fontSize: 14,
  },
  incomesDate: {
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
  sortIcon: {
    marginLeft: 4,
  },
  activeSortButton: {
    borderColor: '#8CE3C3',
    borderWidth: 1,
  },
}) 