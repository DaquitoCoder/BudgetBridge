import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const NotificationsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="bell" size={24} color="#FFFFFF" />
        <Text style={styles.title}>Novedades que te ayudan</Text>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Feather name="x-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notificationsList}>
        {/* Aquí colocarías tus notificaciones reales */}
        <Text style={styles.notification}>
          Has gastado más de lo habitual...
        </Text>
        {/* Repite por cada notificación */}
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
  title: {
    flex: 1,
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  notificationsList: {
    flex: 1,
  },
  notification: {
    color: "#FFFFFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
});

export default NotificationsScreen;
