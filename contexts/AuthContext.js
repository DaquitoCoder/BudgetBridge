import { createContext, useState, useContext, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { ActivityIndicator, View, Text, StyleSheet } from "react-native"

// Crear el contexto
export const AuthContext = createContext()

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext)
}

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    // Configurar el listener de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    // Limpiar el listener cuando el componente se desmonte
    return unsubscribe
  }, [])

  // Valores que estarán disponibles en el contexto
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E2429",
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 16,
  },
})
