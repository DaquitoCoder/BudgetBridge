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
import { getAuth, signOut } from 'firebase/auth';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Button from '../components/Button';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const DashboardScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  const [loaded, error] = useFonts({
    SpaceGroteskBold: require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    SpaceGroteskRegular: require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const handleLogout = () => {
    const auth = getAuth();
    setLoading(true);
    signOut(auth)
      .then(() => {
        // No necesitamos navegar manualmente, el AuthContext se encargará de eso
      })
      .catch((error) => {
        Alert.alert('Error', 'No se pudo cerrar sesión');
        setLoading(false);
      });
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
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
          <TouchableOpacity
            onPress={navigateToProfile}
            style={styles.avatarContainer}
          >
            {currentUser?.photoURL ? (
              <Image
                source={{ uri: currentUser.photoURL }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {currentUser?.email?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text
            style={[styles.welcomeText, { fontFamily: 'SpaceGroteskBold' }]}
          >
            ¡Bienvenid@!
          </Text>

          {currentUser?.displayName && (
            <Text
              style={[styles.displayName, { fontFamily: 'SpaceGroteskBold' }]}
            >
              {currentUser.displayName}
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
              {currentUser?.email}
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
              {currentUser?.uid}
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
              {currentUser?.emailVerified ? 'Sí' : 'No'}
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
              {currentUser?.metadata?.creationTime
                ? new Date(
                    currentUser.metadata.creationTime
                  ).toLocaleDateString()
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
              {currentUser?.metadata?.lastSignInTime
                ? new Date(
                    currentUser.metadata.lastSignInTime
                  ).toLocaleDateString()
                : 'No disponible'}
            </Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToProfile}>
            <Feather name='user' size={24} color='#FF6B6B' />
            <Text style={styles.menuItemText}>Mi Perfil</Text>
            <Feather name='chevron-right' size={24} color='#AAAAAA' />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToSettings}
          >
            <Feather name='settings' size={24} color='#FF6B6B' />
            <Text style={styles.menuItemText}>Configuración</Text>
            <Feather name='chevron-right' size={24} color='#AAAAAA' />
          </TouchableOpacity>

          {/* Puedes añadir más opciones de menú aquí */}
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title='Actualizar perfil'
            onPress={navigateToProfile}
            variant='primary'
          />

          {!currentUser?.emailVerified && (
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
  menuCard: {
    backgroundColor: '#2A3038',
    borderRadius: 12,
    padding: 10,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3A404A',
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
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
