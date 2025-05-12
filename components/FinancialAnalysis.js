import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const analyzeSpending = async (userId) => {
  try {
    // Obtener todos los gastos del usuario
    const spendsRef = collection(db, "gestion_gasto");
    const q = query(spendsRef, where("usuario", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: "No hay datos de gastos para analizar" };
    }

    // Procesar los gastos
    const spendsData = [];
    querySnapshot.forEach((doc) => {
      spendsData.push(doc.data());
    });

    // 1. Análisis de categorías con mayor gasto
    const categoryAnalysis = analyzeSpendingByCategory(spendsData);
    
    // 2. Detección de gastos recurrentes
    const recurringExpenses = detectRecurringExpenses(spendsData);
    
    // 3. Comparación con meses anteriores
    const monthlyComparison = compareMonthlySpending(spendsData);
    
    // 4. Detección de patrones de gasto
    const spendingPatterns = detectSpendingPatterns(spendsData);

    return {
      success: true,
      data: {
        categoryAnalysis,
        recurringExpenses,
        monthlyComparison,
        spendingPatterns
      }
    };

  } catch (error) {
    console.error("Error analyzing spending data:", error);
    return { success: false, message: "Error al analizar los datos de gastos" };
  }
};

export const analyzeSavings = async (userId) => {
  try {
    // Obtener todas las metas de ahorro del usuario
    const goalsRef = collection(db, "metas_ahorro");
    const q = query(goalsRef, where("usuario", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: "No hay datos de ahorro para analizar" };
    }

    // Procesar las metas de ahorro
    const goalsData = [];
    querySnapshot.forEach((doc) => {
      goalsData.push(doc.data());
    });

    // 1. Progreso hacia metas
    const goalsProgress = analyzeGoalsProgress(goalsData);
    
    // 2. Patrones de ahorro
    const savingsPatterns = analyzeSavingsPatterns(goalsData);
    
    // 3. Brechas en ahorros
    const savingsGaps = identifySavingsGaps(goalsData);

    return {
      success: true,
      data: {
        goalsProgress,
        savingsPatterns,
        savingsGaps
      }
    };

  } catch (error) {
    console.error("Error analyzing savings data:", error);
    return { success: false, message: "Error al analizar los datos de ahorro" };
  }
};

// Funciones auxiliares para análisis de gastos
const analyzeSpendingByCategory = (spendsData) => {
  const categories = {};
  
  spendsData.forEach(expense => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }
    categories[expense.category] += expense.amount;
  });

  // Convertir a array y ordenar
  const sortedCategories = Object.entries(categories)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  // Calcular porcentajes
  const totalSpending = sortedCategories.reduce((sum, item) => sum + item.total, 0);
  const categoriesWithPercentage = sortedCategories.map(item => ({
    ...item,
    percentage: Math.round((item.total / totalSpending) * 100)
  }));

  return {
    totalSpending,
    categories: categoriesWithPercentage,
    highestSpendingCategory: categoriesWithPercentage[0]
  };
};

const detectRecurringExpenses = (spendsData) => {
  // Agrupar gastos con el mismo nombre
  const expensesByName = {};
  
  spendsData.forEach(expense => {
    if (!expensesByName[expense.name]) {
      expensesByName[expense.name] = [];
    }
    expensesByName[expense.name].push(expense);
  });

  // Filtrar aquellos con más de 2 ocurrencias en los últimos 3 meses
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
  
  const recurring = Object.entries(expensesByName)
    .filter(([name, expenses]) => {
      const recentExpenses = expenses.filter(exp => {
        const expDate = exp.date.toDate ? exp.date.toDate() : new Date(exp.date);
        return expDate >= threeMonthsAgo;
      });
      return recentExpenses.length >= 2;
    })
    .map(([name, expenses]) => {
      const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const monthlyAverage = total / 3; // 3 meses
      return { name, total, monthlyAverage, count: expenses.length };
    })
    .sort((a, b) => b.monthlyAverage - a.monthlyAverage);

  return recurring;
};

const compareMonthlySpending = (spendsData) => {
  // Agrupar gastos por mes
  const monthlySpending = {};
  
  spendsData.forEach(expense => {
    const date = expense.date.toDate ? expense.date.toDate() : new Date(expense.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!monthlySpending[monthYear]) {
      monthlySpending[monthYear] = 0;
    }
    monthlySpending[monthYear] += expense.amount;
  });

  // Convertir a array y ordenar
  const monthlyData = Object.entries(monthlySpending)
    .map(([monthYear, total]) => {
      const [month, year] = monthYear.split('/');
      return { month: parseInt(month), year: parseInt(year), total };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

  // Calcular variación porcentual
  if (monthlyData.length > 1) {
    const current = monthlyData[0].total;
    const previous = monthlyData[1].total;
    const variation = ((current - previous) / previous) * 100;
    
    return {
      months: monthlyData,
      currentMonth: monthlyData[0],
      previousMonth: monthlyData[1],
      variation: Math.round(variation * 10) / 10 // Redondear a 1 decimal
    };
  }

  return { months: monthlyData };
};

const detectSpendingPatterns = (spendsData) => {
  // Agrupar gastos por día de la semana (0=Domingo, 6=Sábado)
  const dailyPattern = Array(7).fill(0);
  
  spendsData.forEach(expense => {
    const date = expense.date.toDate ? expense.date.toDate() : new Date(expense.date);
    const dayOfWeek = date.getDay();
    dailyPattern[dayOfWeek] += expense.amount;
  });

  // Encontrar día con más gastos
  const maxDayIndex = dailyPattern.indexOf(Math.max(...dailyPattern));
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const maxDay = days[maxDayIndex];

  return {
    dailyPattern,
    maxDay,
    maxDayAmount: dailyPattern[maxDayIndex]
  };
};

// Funciones auxiliares para análisis de ahorros
const analyzeGoalsProgress = (goalsData) => {
  const now = new Date();
  const currentGoals = goalsData.filter(goal => {
    const endDate = goal.endDate.toDate ? goal.endDate.toDate() : new Date(goal.endDate);
    return endDate >= now;
  });

  const progress = currentGoals.map(goal => {
    const progressPercentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
    const daysRemaining = Math.ceil(
      (new Date(goal.endDate.toDate ? goal.endDate.toDate() : new Date(goal.endDate)) - now
    ) / (1000 * 60 * 60 * 24));

    return {
      ...goal,
      progressPercentage,
      daysRemaining,
      dailySavingsNeeded: daysRemaining > 0 
        ? Math.round((goal.targetAmount - goal.currentAmount) / daysRemaining)
        : 0
    };
  });

  // Ordenar por fecha más cercana o progreso más bajo
  progress.sort((a, b) => {
    if (a.progressPercentage < 50 && b.progressPercentage >= 50) return -1;
    if (a.daysRemaining < b.daysRemaining) return -1;
    return 0;
  });

  return progress;
};

const analyzeSavingsPatterns = (goalsData) => {
  // Agrupar ahorros por mes
  const monthlySavings = {};
  
  goalsData.forEach(goal => {
    const date = goal.startDate.toDate ? goal.startDate.toDate() : new Date(goal.startDate);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!monthlySavings[monthYear]) {
      monthlySavings[monthYear] = 0;
    }
    monthlySavings[monthYear] += goal.currentAmount;
  });

  // Convertir a array y ordenar
  const monthlyData = Object.entries(monthlySavings)
    .map(([monthYear, total]) => {
      const [month, year] = monthYear.split('/');
      return { month: parseInt(month), year: parseInt(year), total };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

  // Calcular variación porcentual si hay suficientes datos
  let variation = null;
  if (monthlyData.length > 1) {
    const current = monthlyData[0].total;
    const previous = monthlyData[1].total;
    variation = ((current - previous) / previous) * 100;
  }

  return {
    months: monthlyData,
    variation: variation ? Math.round(variation * 10) / 10 : null
  };
};

const identifySavingsGaps = (goalsData) => {
  const now = new Date();
  const activeGoals = goalsData.filter(goal => {
    const endDate = goal.endDate.toDate ? goal.endDate.toDate() : new Date(goal.endDate);
    return endDate >= now && goal.currentAmount < goal.targetAmount;
  });

  const gaps = activeGoals.map(goal => {
    const endDate = goal.endDate.toDate ? goal.endDate.toDate() : new Date(goal.endDate);
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    const amountNeeded = goal.targetAmount - goal.currentAmount;
    const dailySavingsNeeded = daysRemaining > 0 ? amountNeeded / daysRemaining : amountNeeded;

    return {
      goalName: goal.name,
      amountNeeded,
      daysRemaining,
      dailySavingsNeeded: Math.round(dailySavingsNeeded),
      completionPercentage: Math.round((goal.currentAmount / goal.targetAmount) * 100)
    };
  });

  // Ordenar por brecha más grande (mayor cantidad necesaria por día)
  gaps.sort((a, b) => b.dailySavingsNeeded - a.dailySavingsNeeded);

  return gaps;
};