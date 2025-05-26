import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import GoalNotification from "../components/notifications/GoalNotification";
import MovementNotification from "../components/notifications/MovementNotification";
import SuggestionNotification from "../components/notifications/SuggestionNotification";

const NotificationsScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const drawerStatus = useDrawerStatus();
  const [notifications, setNotifications] = useState([]);
  const [suggestionRead, setSuggestionRead] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const q = query(
        collection(db, "notificaciones"),
        where("usuario", "==", currentUser.email),
        orderBy("fecha", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkSuggestionStatus = async () => {
    const today = new Date().toISOString().split("T")[0];
    const key = `suggestion_seen_${today}`;
    const seen = await AsyncStorage.getItem(key);
    setSuggestionRead(seen === "true");
  };

  const markAllAsRead = async () => {
    try {
      const q = query(
        collection(db, "notificaciones"),
        where("usuario", "==", currentUser.email),
        where("estado", "==", true)
      );
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.forEach((docSnap) => {
        batch.update(doc(db, "notificaciones", docSnap.id), {
          estado: false,
        });
      });
      await batch.commit();

      // También marcar sugerencia como leída
      const today = new Date().toISOString().split("T")[0];
      await AsyncStorage.setItem(`suggestion_seen_${today}`, "true");
      setSuggestionRead(true);

      fetchNotifications();
    } catch (error) {
      console.error("Error marcando como leídas:", error);
    }
  };

  // Recarga al entrar a la screen
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
      checkSuggestionStatus();
    }, [currentUser.email])
  );

  // Recarga si el drawer se abre
  useEffect(() => {
    if (drawerStatus === "open") {
      setLoading(true);
      fetchNotifications();
      checkSuggestionStatus();
    }
  }, [drawerStatus]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="bell" size={24} color="#B6F2DC" />
          <Text style={styles.title}>Novedades que te ayudan</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Feather name="x-circle" size={24} color="#B6F2DC" />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      <TouchableOpacity onPress={markAllAsRead}>
        <Text style={styles.markAll}>Marcar como leído todo</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#B6F2DC"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView style={styles.notificationsList}>
          {/* Sugerencia diaria */}
          <SuggestionNotification
            key="sugerencia-diaria"
            date={new Date()}
            message='Has gastado más de lo habitual en "Comidas afuera". ¿Quieres revisar tus hábitos?'
            read={suggestionRead}
          />

          {/* Notificaciones desde Firebase */}
          {notifications.map((notif) => {
            const date = notif.fecha?.toDate?.() || new Date();
            const read = notif.estado === false;

            switch (notif.tipo) {
              case "meta":
                return (
                  <GoalNotification
                    key={notif.id}
                    id={notif.id}
                    date={date}
                    message={notif.accion}
                    read={read}
                  />
                );
              case "movimiento":
                return (
                  <MovementNotification
                    key={notif.id}
                    id={notif.id}
                    date={date}
                    message={notif.accion}
                    read={read}
                  />
                );
              default:
                return null;
            }
          })}
        </ScrollView>
      )}
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
    fontFamily: "SpaceGroteskBold",
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
});

export default NotificationsScreen;
