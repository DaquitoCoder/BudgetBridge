'use client';

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Button from '../components/Button';
import { Feather } from '@expo/vector-icons';

const DashboardScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    SpaceGroteskRegular: require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Si no hay usuario, redirigir al login
        navigation.replace('Login');
      }
      setLoading(false);
    });

    // Limpiar el listener cuando el componente se desmonte
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    setLoading(true);
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => {
        Alert.alert('Error', 'No se pudo cerrar sesión');
        setLoading(false);
      });
  };

  if (!loaded && !error) {
    return null;
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size='large' color='#FF6B6B' />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontFamily: 'SpaceGroteskBold' }]}>
          Dashboard
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Feather name='log-out' size={24} color='#FF6B6B' />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.email?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </View>

          <Text
            style={[styles.welcomeText, { fontFamily: 'SpaceGroteskBold' }]}
          >
            ¡Bienvenid@!
          </Text>

          {user?.displayName && (
            <Text
              style={[styles.displayName, { fontFamily: 'SpaceGroteskBold' }]}
            >
              {user.displayName}
            </Text>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={[styles.infoTitle, { fontFamily: 'SpaceGroteskBold' }]}>
            Información de la cuenta
          </Text>

          <View style={styles.infoRow}>
            <Text
              style={[styles.infoLabel, { fontFamily: 'SpaceGroteskRegular' }]}
            >
              Email:
            </Text>
            <Text
              style={[styles.infoValue, { fontFamily: 'SpaceGroteskRegular' }]}
            >
              {user?.email}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[styles.infoLabel, { fontFamily: 'SpaceGroteskRegular' }]}
            >
              ID de usuario:
            </Text>
            <Text
              style={[styles.infoValue, { fontFamily: 'SpaceGroteskRegular' }]}
            >
              {user?.uid}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[styles.infoLabel, { fontFamily: 'SpaceGroteskRegular' }]}
            >
              Email verificado:
            </Text>
            <Text
              style={[styles.infoValue, { fontFamily: 'SpaceGroteskRegular' }]}
            >
              {user?.emailVerified ? 'Sí' : 'No'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[styles.infoLabel, { fontFamily: 'SpaceGroteskRegular' }]}
            >
              Creado el:
            </Text>
            <Text
              style={[styles.infoValue, { fontFamily: 'SpaceGroteskRegular' }]}
            >
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : 'No disponible'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[styles.infoLabel, { fontFamily: 'SpaceGroteskRegular' }]}
            >
              Último acceso:
            </Text>
            <Text
              style={[styles.infoValue, { fontFamily: 'SpaceGroteskRegular' }]}
            >
              {user?.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                : 'No disponible'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title='Actualizar perfil'
            onPress={() => {}}
            variant='primary'
          />

          {!user?.emailVerified && (
            <Button
              title='Verificar email'
              onPress={() => {}}
              variant='outline'
              style={{ marginTop: 12 }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2429',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1E2429',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 8,
  },
  displayName: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  infoCard: {
    backgroundColor: '#2A3038',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#AAAAAA',
    fontSize: 16,
    width: '40%',
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  actionsContainer: {
    marginBottom: 40,
  },
});

export default DashboardScreen;
