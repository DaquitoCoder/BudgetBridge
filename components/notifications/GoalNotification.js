import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const GoalNotification = ({ id, date, message, read }) => {
  const navigation = useNavigation();
  const dateStr = date.toLocaleDateString("es-CO");
  const timeStr = date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePress = () => {
    navigation.navigate("GoalsScreen"); // 🔄 Primero redirige
    updateDoc(doc(db, "notificaciones", id), { estado: false }).catch((e) =>
      console.error("Error marcando como leído:", e)
    );
  };

  return (
    <View
      style={[
        styles.notificationItem,
        { borderBottomColor: read ? "#555" : "#D95F80" },
      ]}
    >
      <Text style={styles.notificationDate}>
        {dateStr} • {timeStr} • Metas de ahorro
      </Text>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationText, read && { color: "#AAA" }]}>
          {message}
        </Text>
        <TouchableOpacity
          onPress={handlePress}
          style={[
            styles.iconButton,
            { borderColor: read ? "#555" : "#D95F80" },
          ]}
        >
          <Feather
            name="arrow-right"
            size={24}
            color={read ? "#AAA" : "#D95F80"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default GoalNotification;
