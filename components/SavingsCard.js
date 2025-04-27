import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useIsFocused } from "@react-navigation/native";
import SemiCircularProgress from "./SemiCircularProgress";
import AddGoalActionSheet from "./AddGoalActionSheet";

/**
 * SavingsCard muestra la meta de ahorro mensual.
 * @param showViewAll: si es true, muestra el botón "Ver todas mis metas".
 * Se recarga cada vez que la pantalla está enfocada.
 */
const SavingsCard = ({ email, onViewAllPress, showViewAll = true }) => {
  const isFocused = useIsFocused();
  const [meta, setMeta] = useState(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [progressValue, setProgressValue] = useState(0);
  const actionSheetRef = useRef();

  const fetchMeta = async () => {
    if (!email) return;
    const docSnap = await getDoc(doc(db, "meta_ahorro_personal", email));
    if (docSnap.exists()) {
      const data = docSnap.data();
      setMeta(data);
      const porcentaje = Math.min(
        (data.valor_ahorrado / data.valor_meta) * 100,
        100
      );
      Animated.timing(progressAnim, {
        toValue: porcentaje,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  };

  // Recarga la meta cada vez que el screen obtiene foco o cambia el email
  useEffect(() => {
    if (isFocused) fetchMeta();
  }, [email, isFocused]);

  useEffect(() => {
    const id = progressAnim.addListener(({ value }) => setProgressValue(value));
    return () => progressAnim.removeListener(id);
  }, [progressAnim]);

  const openAddGoalSheet = () => actionSheetRef.current?.show();

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {meta ? "Meta de ahorro mensual" : "Define tus metas de ahorro mensual"}
      </Text>

      <View style={styles.savingsContainer}>
        <SemiCircularProgress size={180} progress={progressValue} />
      </View>

      <View style={styles.amountSection}>
        <Text style={styles.savingsAmount}>
          ${meta?.valor_ahorrado?.toLocaleString() || "0"}
        </Text>
        <Text style={styles.savingsTotal}>
          /${meta?.valor_meta?.toLocaleString() || "0"}
        </Text>
      </View>

      {!meta && (
        <Text style={styles.cardDescription}>
          Establece objetivos de ahorro para este mes y te ayudaremos a mantener
          el rumbo. ¡Tú puedes!
        </Text>
      )}

      <TouchableOpacity style={styles.addButton} onPress={openAddGoalSheet}>
        <Feather name="edit-2" size={18} color="#FFFFFF" />
        <Text style={styles.addButtonText}>
          {meta ? "Editar meta del mes" : "Agregar meta del mes"}
        </Text>
      </TouchableOpacity>

      {showViewAll && (
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>Ver todas mis metas</Text>
        </TouchableOpacity>
      )}

      <AddGoalActionSheet
        ref={actionSheetRef}
        email={email}
        meta={meta}
        onSaveSuccess={fetchMeta}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2A3038",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "SpaceGroteskBold",
    textAlign: "center",
  },
  savingsContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  amountSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  savingsAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "SpaceGroteskBold",
  },
  savingsTotal: {
    color: "#AAAAAA",
    fontSize: 18,
    fontFamily: "SpaceGroteskRegular",
  },
  cardDescription: {
    color: "#AAAAAA",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: "SpaceGroteskRegular",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    marginBottom: 12,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "SpaceGroteskRegular",
  },
  viewAllButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 8,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
});

export default SavingsCard;
