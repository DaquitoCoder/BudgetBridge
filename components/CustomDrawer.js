'use client';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

const CustomDrawer = (props) => {
  const { currentUser } = useAuth();
  
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
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
                  {currentUser?.displayName?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.userName}>
            {currentUser?.displayName || 'Usuario'}
          </Text>
          <Text style={styles.userEmail}>{currentUser?.email}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.separator} />

      <DrawerItemList {...props} />

      <View style={styles.separator} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name='log-out' size={20} color='#FF6B6B' />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  profileSection: {
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#2A3038',
    marginVertical: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginLeft: 16,
  },
});

export default CustomDrawer;
