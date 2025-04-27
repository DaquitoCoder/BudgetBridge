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
import SemiCircularProgress from "./SemiCircularProgress";
import AddGoalActionSheet from "./AddGoalActionSheet";

/**
 * SavingsCard muestra la meta de ahorro mensual.
 * @param showViewAll: si es true, muestra el botón "Ver todas mis metas".
 */
const SavingsCard = ({ email, onViewAllPress, showViewAll = true }) => {
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

  useEffect(() => {
    fetchMeta();
  }, [email]);

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

      <Text style={styles.cardDescription}>
        {meta
          ? "¡Sigue así! Estás avanzando en tu meta de ahorro mensual."
          : "Establece objetivos de ahorro para este mes y te ayudaremos a mantener el rumbo. ¡Tú puedes!"}
      </Text>

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
  },
  savingsContainer: {
    marginVertical: 24,
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
    backgroundColor: "#1E2429",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
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
    padding: 12,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
});

export default SavingsCard;
