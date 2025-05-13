import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Header from "../components/Header";
import CurrencyPicker from '../components/CurrencyPicker';
import Input from "../components/Input";
import Button from "../components/Button";
import { getAuth, updatePassword } from "firebase/auth";
import {Modal} from 'react-native';
import { updateEmail, updateProfile } from 'firebase/auth';

const ProfileConfigScreen = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [notificationType, setNotificationType] = useState("push");
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: 'COP',
    name: 'Peso Colombiano',
    symbol: '$'
  });
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [newName, setNewName] = useState(currentUser?.displayName || '');
  const [newEmail, setNewEmail] = useState(currentUser?.email || '');

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });

  const handleUpdateProfile = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert('Error', 'Ingresa un email válido');
      return;
    }

    setIsUpdating(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // Actualizar nombre
      await updateProfile(user, {
        displayName: newName
      });

      // Actualizar email (requiere reautenticación)
      if (newEmail !== currentUser.email) {
        await updateEmail(user, newEmail);
      }

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      let errorMessage = 'Error al actualizar el perfil';
      
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Debes reautenticarte para cambiar el email';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está en uso';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Por favor completa ambos campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsUpdating(true);

    try {
      const auth = getAuth();
      await updatePassword(auth.currentUser, newPassword);
      
      Alert.alert("Éxito", "Contraseña actualizada correctamente");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      
      let errorMessage = "Ocurrió un error al cambiar la contraseña";
      if (error.code === "auth/requires-recent-login") {
        errorMessage = "Por favor, vuelve a iniciar sesión antes de cambiar tu contraseña";
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCurrencyChange = () => {
    // Abrir modal o pantalla con selección de moneda (esto es solo placeholder)
    Alert.alert("Próximamente", "Podrás cambiar tu moneda aquí.");
  };

  const toggleNotificationType = () => {
    setNotificationType(prev => (prev === "push" ? "email" : "push"));
  };
  
  return (
    <View style={styles.container}>
      <Header title="Tu perfil" />
      <ScrollView style={styles.content}>

        {/* Info de Usuario */}
        <View style={styles.suggestionCard}>
        <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
            {currentUser?.photoURL ? (
                <Image
                source={{ uri: currentUser.photoURL }}
                style={styles.avatar}
                />
            ) : (
                <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                    {currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
                </Text>
                </View>
            )}
            </View>
            
            <View style={styles.profileInfo}>
            <Text style={styles.pageTitle}>{currentUser?.displayName}</Text>
            <Text style={styles.subtitle}>{currentUser?.email}</Text>
            </View>
        </View>
        
        <Button
            title="Editar información"
            onPress={() => setIsEditing(true)}
            variant="outline"
            icon="edit"
            style={styles.actionButton}
        />
        {/* Modal de edición */}
      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar información</Text>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Feather name="x" size={24} color="#52D1A1" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Tu nombre"
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button
            title="Guardar cambios"
            onPress={handleUpdateProfile}
            variant="primary"
            loading={isUpdating}
            disabled={isUpdating}
            style={styles.saveButton}
          />
        </View>
        </Modal>
        </View>

        {/* Selector de moneda */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Elige tu moneda preferida</Text>
        <TouchableOpacity
          style={styles.currencySelector}
          onPress={() => setShowCurrencyPicker(true)}
        >
          <Text style={styles.currencyText}>
            {selectedCurrency.code} - {selectedCurrency.name}
          </Text>
          <Feather name="chevron-right" size={20} color="#52D1A1" />
        </TouchableOpacity>
      </View>

      {showCurrencyPicker && (
        <CurrencyPicker
          onSelect={(currency) => {
            setSelectedCurrency(currency);
            setShowCurrencyPicker(false);
          }}
          onClose={() => setShowCurrencyPicker(false)}
        />
      )}

       {/* Cambiar contraseña */}
        <View style={styles.suggestionCard}>
        <Text style={styles.suggestionTitle}>Actualiza tu contraseña</Text>
        
        <Input
            placeholder="Escribe tu nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            icon="lock"
        />
        
        <Input
            placeholder="Confirma tu nueva contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="lock"
        />
        
        <Button
            title="Cambiar contraseña"
            onPress={handlePasswordChange}
            variant="outline"
            icon="lock"
            style={styles.actionButton}
            loading={isUpdating}
            disabled={isUpdating}
        />
        </View>

        {/* Tipo de notificación */}
        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionTitle}>¿Cómo prefieres recibir las notificaciones?</Text>

          <TouchableOpacity
            style={[
              styles.optionButton,
              notificationType === "push" && styles.optionButtonSelected,
            ]}
            onPress={() => setNotificationType("push")}
          >
            <Feather name="smartphone" size={16} color="#FFFFFF" />
            <Text style={styles.optionText}>Notificaciones push</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              notificationType === "email" && styles.optionButtonSelected,
            ]}
            onPress={() => setNotificationType("email")}
          >
            <Feather name="mail" size={16} color="#FFFFFF" />
            <Text style={styles.optionText}>Notificaciones por correo</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
// aquí mantenés exactamente los styles que ya tenías
container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro
  },
  content: {
    padding: 16,
  },
  suggestionCard: {
    backgroundColor: "#2A3038",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'SpaceGroteskBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    color: "#8E9A9D",
    fontSize: 14,
    fontFamily: "SpaceGroteskRegular",
    marginBottom: 24,
  },
  suggestionTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGroteskBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#2D2D2D',
    borderRadius: 6,
    padding: 12,
    color: '#FFFFFF',
    marginVertical: 8,
    fontFamily: 'SpaceGroteskRegular',
    borderWidth: 1,
    borderColor: '#333333',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D2D',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  optionButtonSelected: {
    borderColor: '#52D1A1', // Verde/cian como en el mockup
    borderWidth: 1.5,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 10,
    fontFamily: 'SpaceGroteskRegular',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  actionText: {
    color: '#52D1A1', // Color verde/cian para acciones
    fontFamily: 'SpaceGroteskBold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 16,
  },
  
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  avatarContainer: {
    marginRight: 16,
  },
  
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  
  profileInfo: {
    flex: 1,
  },
  
  pageTitle: {
    fontSize: 18,
    fontFamily: 'SpaceGroteskBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  
  subtitle: {
    fontSize: 14,
    fontFamily: 'SpaceGroteskRegular',
    color: '#BDBDBD',
  },
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  
  actionText: {
    color: '#52D1A1',
    fontFamily: 'SpaceGroteskBold',
    fontSize: 14,
    marginLeft: 6,
  },
  container: {
    flex: 1,
    backgroundColor: '#1E2429',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SpaceGroteskRegular',
    marginBottom: 8,
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A3038',
    borderRadius: 8,
    padding: 16,
  },
  currencyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'SpaceGroteskRegular',
  },
  actionButton: {
    alignSelf: 'flex-end',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  saveButton: {
    marginTop: 32,
  },
  label: {
    color: '#FFFFFF',
    fontFamily: 'SpaceGroteskRegular',
    marginBottom: 8,
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'SpaceGroteskBold',
    color: '#FFFFFF',
  },
});

export default ProfileConfigScreen;
