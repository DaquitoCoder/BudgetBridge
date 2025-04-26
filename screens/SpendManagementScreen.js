import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar 
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import Header from "../components/Header"

export default function App() {
    const [loaded, error] = useFonts({
        SpaceGroteskBold: require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
        SpaceGroteskRegular: require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
      });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: "Almuerzo universitario",
      amount: 12000,
      category: "Comida",
      date: "05/02/2025",
    },
    {
      id: 2,
      name: "Recarga transporte",
      amount: 10000,
      category: "Transporte",
      date: "06/02/2025",
    },
    {
      id: 3,
      name: "Café y snack",
      amount: 8000,
      category: "Comida",
      date: "06/02/2025",
    },
    {
      id: 4,
      name: "Cuaderno nuevo",
      amount: 12000,
      category: "Varios",
      date: "07/02/2025",
    },
    {
      id: 5,
      name: "Galletas y jugo",
      amount: 7000,
      category: "Comida",
      date: "09/02/2025",
    },
  ]);

  const handleAddExpense = () => {
    if (!name || !amount || !category || !date) {
      alert("Por favor complete todos los campos.");
      return;
    }

    setIsSubmitting(true);

    const newRecipe = {
      strMeal: mealName,
      strCategory: category,
      strInstructions: instructions,
      ingredients: ingredients,
      strMealThumb: imageUri || "",
    };

    push(dbRef(database, "/userRecipes"), newRecipe)
      .then(() => {
        alert("Receta creada con éxito");
        setMealName("");
        setCategory("");
        setInstructions("");
        setIngredients([""]);
        setImageUri(null);
      })
      .catch((error) => {
        console.error("Error al crear receta: ", error);
        alert("Hubo un error al crear la receta.");
      })
      .finally(() => setIsSubmitting(false));
  };

  const totalMonth = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatCurrency = (amount) => {
    return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

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
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="sliders" size={16} color="white" />
            <Text style={styles.filterText}>Filtrar por</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="sort-by-alpha" size={16} color="white" />
            <Text style={styles.filterText}>Ordenar por</Text>
          </TouchableOpacity>
        </View>
        
        {/* Expenses List */}
        <View style={styles.dashboardCard}>
        <Text style={styles.sectionTitle}>Gastos recientes</Text>
        <ScrollView style={styles.expensesList}>
          {expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseItem}>
              <View style={styles.expenseRow}>
                <Text style={styles.expenseName}>{expense.name}</Text>
                <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
              </View>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseCategory}>Categoría: {expense.category}</Text>
                <Text style={styles.expenseDate}>{expense.date}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        </View>
        
        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total del mes:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalMonth)}</Text>
        </View>
        
        {/* Add Button */}
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={20} color="black" />
          <Text style={styles.addButtonText}>Agregar gasto</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#363E40',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(140, 227, 195, 0.2)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
    color: 'white',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3038',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 8,
  },
  filterText: {
    color: 'white',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginBottom: 12,
  },
  expensesList: {
    flex: 1,
  },
  expenseItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
    paddingBottom: 12,
    marginBottom: 12,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expenseName: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  expenseAmount: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  expenseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  expenseCategory: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  expenseDate: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  totalAmount: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#8CE3C3',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 16,
    gap: 8,
  },
  addButtonText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 16,
  },
  dashboardCard: {
    backgroundColor: "#2A3038",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
});