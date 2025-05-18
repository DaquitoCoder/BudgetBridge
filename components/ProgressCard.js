import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/config"
import { Timestamp } from "firebase/firestore"

const ProgressCard = ({ email, onAddExpense, onAddIncome }) => {
  const [expenses, setExpenses] = useState(0)
  const [income, setIncome] = useState(0)

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) return null

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
        const startTimestamp = Timestamp.fromDate(startOfMonth)
        const endTimestamp = Timestamp.fromDate(endOfMonth)

        const spendsRef = collection(db, "gestion_gasto")

        const q = query(
          spendsRef,
          where("usuario", "==", email),
          where("date", ">=", startTimestamp),
          where("date", "<=", endTimestamp),
        )

        const querySnapshot = await getDocs(q)
        const categoryTotals = querySnapshot.docs.reduce((acc, doc) => {
          const data = doc.data()
          const amount = Number(data.amount) || 0
          return acc + amount
        }, 0)
        setExpenses(categoryTotals)
      } catch (e) {
        console.error("Error al obtener categorías:", e)
        setTopCategories([])
      }
    }

    if (email) fetchExpenses()
  }, [email])

  return (
    <View style={styles.dashboardCard}>
      {expenses > 0 ? (
        <View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>${(income - expenses).toLocaleString("es-CO")}</Text>
            <View style={styles.progressCircleSmall}>
              <Text style={styles.progressTextSmall}>{1}%</Text>
            </View>
          </View>
          <Text style={styles.balanceLabel}>Total disponible</Text>

          <View style={[styles.expenseRow, styles.cardSection]}>
            <View>
              <Text style={styles.expenseAmount}>${expenses.toLocaleString("es-CO")}</Text>
              <Text style={styles.expenseLabel}>Gastos del mes</Text>
            </View>
            <View style={[styles.progressCircleSmall, styles.expenseCircle]}>
              <Text style={styles.progressTextSmall}>{1}%</Text>
            </View>
          </View>

          <View style={[styles.incomeRow, styles.cardSection]}>
            <View>
              <Text style={styles.incomeAmount}>${income.toLocaleString("es-CO")}</Text>
              <Text style={styles.incomeLabel}>Ingresos del mes</Text>
            </View>
            <View style={[styles.progressCircleSmall, styles.incomeCircle]}>
              <Text style={styles.progressTextSmall}>{1}%</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>0%</Text>
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>¡Empieza a registrar tus ingresos y gastos!</Text>
            <Text style={styles.progressDescription}>
              Anota tus movimientos para <Text style={styles.bold}>visualizar aquí</Text> tus{" "}
              <Text style={styles.bold}>gráficas</Text> de control financiero. ¡Verás qué fácil es entender a dónde va
              tu dinero!
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={onAddExpense} activeOpacity={0.85}>
        <Feather name="plus" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.addButtonText}>
          Agregar <Text style={styles.expenseText}>gasto</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={onAddIncome} activeOpacity={0.85}>
        <Feather name="plus" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.addButtonText}>
          Agregar <Text style={styles.incomeText}>ingreso</Text>
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  dashboardCard: {
    backgroundColor: "#232728",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
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
    backgroundColor: "transparent",
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
    color: "#FFFFFF",
    fontFamily: "SpaceGroteskBold",
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
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontFamily: "SpaceGroteskBold",
  },
  balanceLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "SpaceGroteskRegular",
    marginBottom: 16,
  },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2C3132",
    borderRadius: 12,
    padding: 16,
  },
  expenseAmount: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "SpaceGroteskBold",
  },
  expenseLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
  incomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2C3132",
    borderRadius: 12,
    padding: 16,
  },
  incomeAmount: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "SpaceGroteskBold",
  },
  incomeLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
  progressCircleSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#D1D5DB",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  progressTextSmall: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "SpaceGroteskBold",
  },
  expenseCircle: {
    borderColor: "#E78DA5",
  },
  incomeCircle: {
    borderColor: "#D1D5DB",
  },
  cardSection: {
    marginBottom: 12,
  },
  addExpenseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#232728",
    paddingVertical: 14,
    marginBottom: 14,
    marginTop: 8,
  },
  addIncomeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#232728",
    paddingVertical: 14,
    marginBottom: 0,
  },
})

export default ProgressCard;