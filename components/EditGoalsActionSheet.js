import React, { useState, useEffect, useImperativeHandle, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AddEditGoalActionSheet from "./AddEditGoalActionSheet";

/**
 * EditGoalsActionSheet permite seleccionar una meta existente, editarla, crear nueva o cancelar.
 * - show(): carga las metas y despliega el sheet.
 * - onEdit(data): callback con la meta actualizada.
 * - onAddNew(data): callback con la nueva meta.
 */
const EditGoalsActionSheet = React.forwardRef(
  ({ onEdit, onAddNew, onCancel }, ref) => {
    const [metas, setMetas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const sheetRef = useRef();
    const addEditRef = useRef();

    const [loaded, error] = useFonts({
      SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
      SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
    });

    useEffect(() => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]);

    useImperativeHandle(ref, () => ({
      show: async () => {
        setLoading(true);
        try {
          const snapshot = await getDocs(collection(db, "meta_ahorro"));
          const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMetas(list);
          setSelectedId(null);
        } catch (e) {
          console.error("Error loading metas:", e);
        } finally {
          setLoading(false);
          sheetRef.current?.show();
        }
      },
      hide: () => sheetRef.current?.hide(),
    }));

    const handleEdit = () => {
      sheetRef.current?.hide();
      addEditRef.current?.show("edit", selectedId);
    };

    const handleAddNew = () => {
      sheetRef.current?.hide();
      addEditRef.current?.show("add");
    };

    const handleCancel = () => {
      onCancel?.();
      sheetRef.current?.hide();
    };

    // Callbacks from AddEditGoalActionSheet
    const handleSave = (data, id) => {
      if (id) onEdit?.(data, id);
      else onAddNew?.(data);
      sheetRef.current?.hide();
    };

    if (!loaded && !error) return null;

    return (
      <>
        <ActionSheet ref={sheetRef} containerStyle={styles.sheet}>
          <View style={styles.container}>
            <Text style={styles.title}>Elige o crea una meta</Text>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#B6F2DC"
                style={{ marginVertical: 20 }}
              />
            ) : (
              metas.map((meta) => (
                <TouchableOpacity
                  key={meta.id}
                  style={[
                    styles.metaItem,
                    selectedId === meta.id && styles.metaItemSelected,
                  ]}
                  onPress={() => setSelectedId(meta.id)}
                >
                  <View style={styles.radioCircle}>
                    {selectedId === meta.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.metaText,
                      selectedId === meta.id && styles.metaTextSelected,
                    ]}
                  >
                    {meta.nombre_meta || meta.nombre || "Meta"}
                  </Text>
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              style={[
                styles.actionButton,
                selectedId
                  ? styles.actionButtonActive
                  : styles.actionButtonInactive,
              ]}
              onPress={handleEdit}
              disabled={!selectedId}
            >
              <Text
                style={[
                  styles.actionText,
                  selectedId
                    ? styles.actionTextActive
                    : styles.actionTextInactive,
                ]}
              >
                Editar meta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
              <Text style={styles.addText}>+ Agregar meta nueva</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>

        {/* ActionSheet form para agregar/editar */}
        <AddEditGoalActionSheet
          ref={addEditRef}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </>
    );
  }
);

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: "#2A3038",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  container: { padding: 20 },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "SpaceGroteskBold",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4A4A4A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  metaItemSelected: { borderColor: "#B6F2DC" },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4A4A4A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#B6F2DC",
  },
  metaText: {
    color: "#AAAAAA",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
  metaTextSelected: { color: "#B6F2DC" },
  actionButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  actionButtonInactive: { backgroundColor: "#2A3038", borderColor: "#B6F2DC" },
  actionButtonActive: { backgroundColor: "#B6F2DC", borderColor: "#B6F2DC" },
  actionText: { fontSize: 16, fontFamily: "SpaceGroteskBold" },
  actionTextInactive: { color: "#B6F2DC" },
  actionTextActive: { color: "#000000" },
  addButton: {
    borderWidth: 1,
    borderColor: "#B6F2DC",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  addText: {
    color: "#B6F2DC",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
});

export default EditGoalsActionSheet;
