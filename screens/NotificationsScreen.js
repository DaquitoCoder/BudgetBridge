import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const NotificationsScreen = () => {
  const navigation = useNavigation();

  const closeDrawer = () => {
    navigation.goBack();
  };

  const navigateToGoals = () => {
    navigation.navigate("GoalsScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="bell" size={24} color="#B6F2DC" />
          <Text style={styles.title}>Novedades que te ayudan</Text>
        </View>
        <TouchableOpacity onPress={closeDrawer}>
          <Feather name="x-circle" size={24} color="#B6F2DC" />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      <TouchableOpacity>
        <Text style={styles.markAll}>Marcar como leído todo</Text>
      </TouchableOpacity>

      <ScrollView style={styles.notificationsList}>
        {/* Sugerencias */}
        <View
          style={[styles.notificationItem, { borderBottomColor: "#B6F2DC" }]}
        >
          <Text style={styles.notificationDate}>
            Hoy • Hace unos minutos • Sugerencias
          </Text>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>
              Has gastado más de lo habitual en "Comidas afuera". ¿Quieres
              revisar tus hábitos?
            </Text>
            <TouchableOpacity
              style={[styles.iconButton, { borderColor: "#B6F2DC" }]}
            >
              <Feather name="arrow-right" size={24} color="#B6F2DC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Metas de ahorro */}
        <View
          style={[styles.notificationItem, { borderBottomColor: "#D95F80" }]}
        >
          <Text style={styles.notificationDate}>
            Hoy • Hace una hora • Metas de ahorro
          </Text>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>
              ¡Ya casi alcanzas tu meta de ahorro de abril! Estás a un paso de
              lograrlo.
            </Text>
            <TouchableOpacity
              onPress={navigateToGoals}
              style={[styles.iconButton, { borderColor: "#D95F80" }]}
            >
              <Feather name="arrow-right" size={24} color="#D95F80" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Movimientos */}
        <View
          style={[styles.notificationItem, { borderBottomColor: "#7AB6DA" }]}
        >
          <Text style={styles.notificationDate}>
            20/04/25 • 11:00 pm • Movimientos
          </Text>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>
              Agregaste un nuevo ingreso: $500.000 - "Freelance"
            </Text>
            <TouchableOpacity
              style={[styles.iconButton, { borderColor: "#7AB6DA" }]}
            >
              <Feather name="arrow-right" size={24} color="#7AB6DA" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#363E40",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "#B6F2DC",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  line: {
    height: 1,
    backgroundColor: "#B6F2DC",
    marginBottom: 20,
  },
  markAll: {
    color: "#B6F2DC",
    marginBottom: 20,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  notificationDate: {
    color: "#8E9A9D",
    fontSize: 12,
    marginBottom: 4,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationText: {
    color: "#FFFFFF",
    fontSize: 14,
    flex: 1,
    paddingRight: 8,
  },
  iconButton: {
    padding: 4,
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default NotificationsScreen;
