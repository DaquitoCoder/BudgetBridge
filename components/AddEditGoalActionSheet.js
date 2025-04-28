import React, { useState, useImperativeHandle, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SplashScreen from "expo-splash-screen";
import { Feather } from "@expo/vector-icons";
import {
  getDocs,
  getDoc,
  collection,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import { useFonts } from "expo-font";

// Formatea números con puntos de miles
const formatWithDots = (value) => {
  const numeric = value.replace(/\D/g, "");
  return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const AddEditGoalActionSheet = React.forwardRef(({ onSave, onCancel }, ref) => {
  const sheetRef = useRef();
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email || "";

  const [mode, setMode] = useState("add");
  const [goalId, setGoalId] = useState(null);
  const [categories, setCategories] = useState([]);
  const frequencies = [
    "Diario",
    "Semanal",
    "Mensual",
    "Bimestral",
    "Trimestral",
    "Semestral",
    "Anual",
  ];

  // Form state
  const [category, setCategory] = useState("");
  const [startDateObj, setStartDateObj] = useState(null);
  const [hasEnd, setHasEnd] = useState(false);
  const [endDateObj, setEndDateObj] = useState(null);
  const [frequency, setFrequency] = useState("");
  const [valueMeta, setValueMeta] = useState("");
  const [valueSaved, setValueSaved] = useState("");
  const [name, setName] = useState("");

  const [openSection, setOpenSection] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carga de fuentes
  const [loaded, error] = useFonts({
    SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
  });
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // Manejador imperativo
  useImperativeHandle(ref, () => ({
    show: async (_mode, id) => {
      setMode(_mode);
      setGoalId(id || null);
      setLoading(true);

      // Cargar categorías de Firestore
      try {
        const snap = await getDocs(collection(db, "categoria"));
        setCategories(
          snap.docs.map((d) => ({ id: d.id, nombre: d.data().nombre }))
        );
      } catch (e) {
        console.error("Error cargando categorías:", e);
      }

      if (_mode === "edit" && id) {
        try {
          const ds = await getDoc(doc(db, "meta_ahorro", id));
          if (ds.exists()) {
            const d = ds.data();
            setCategory(d.categoria || "");
            setStartDateObj(
              d.fecha_inicio?.toDate
                ? d.fecha_inicio.toDate()
                : new Date(d.fecha_inicio)
            );
            setHasEnd(!!d.tiene_final);
            setEndDateObj(
              d.fecha_final?.toDate
                ? d.fecha_final.toDate()
                : new Date(d.fecha_final)
            );
            setFrequency(d.frecuencia || "");
            setValueMeta(formatWithDots(String(d.valor_meta)));
            setValueSaved(formatWithDots(String(d.total_ahorrado)));
            setName(d.nombre_meta || "");
          }
        } catch (e) {
          console.error("Error cargando meta para editar:", e);
        }
      } else {
        // Resetear
        setCategory("");
        setStartDateObj(null);
        setHasEnd(false);
        setEndDateObj(null);
        setFrequency("");
        setValueMeta("");
        setValueSaved("");
        setName("");
      }

      setOpenSection(null);
      setLoading(false);
      sheetRef.current?.show();
    },
    hide: () => sheetRef.current?.hide(),
  }));

  const toggle = (sec) => setOpenSection(openSection === sec ? null : sec);

  // Guardar meta
  const handleSave = async () => {
    if (
      !category ||
      !startDateObj ||
      !frequency ||
      !valueMeta ||
      !valueSaved ||
      !name
    ) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    const categoryId = categories.find((c) => c.nombre === category)?.id;
    if (!categoryId) {
      Alert.alert("Error", "Selecciona una categoría válida.");
      return;
    }

    const valor_meta_num = parseFloat(valueMeta.replace(/\./g, ""));
    const total_ahorrado_num = parseFloat(valueSaved.replace(/\./g, ""));

    const payload = {
      usuario_correo: userEmail,
      categoria: category,
      categoria_id: categoryId,
      fecha_inicio: startDateObj,
      tiene_final: hasEnd,
      fecha_final: hasEnd ? endDateObj : null,
      frecuencia: frequency,
      valor_meta: valor_meta_num,
      total_ahorrado: total_ahorrado_num,
      nombre_meta: name,
    };

    setSaving(true);
    try {
      if (goalId) {
        await setDoc(doc(db, "meta_ahorro", goalId), payload, { merge: true });
      } else {
        await addDoc(collection(db, "meta_ahorro"), payload);
      }
      onSave(payload, goalId);
      sheetRef.current?.hide();
    } catch (e) {
      console.error("Error al guardar:", e);
      Alert.alert("Error", "No se pudo guardar la meta.");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded && !error) return null;

  return (
    <ActionSheet
      ref={sheetRef}
      containerStyle={styles.sheet}
      keyboardHandlerEnabled={false}
      maskEnabled={false}
      closeOnDragDown={false}
      gestureEnabled={false}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {mode === "add" ? "Agregar meta nueva" : "Editar meta"}
        </Text>

        {loading ? (
          <ActivityIndicator
            color="#B6F2DC"
            size="large"
            style={{ marginVertical: 20 }}
          />
        ) : (
          <>
            {/* Categoría */}
            <TouchableOpacity
              style={styles.row}
              onPress={() => toggle("category")}
            >
              <Text style={styles.rowText}>
                {category || "Escoger categoría de meta"}
              </Text>
              <View style={styles.arrowCircle}>
                <Feather
                  name={
                    openSection === "category"
                      ? "chevron-down"
                      : "chevron-right"
                  }
                  size={18}
                  color="#000"
                />
              </View>
            </TouchableOpacity>
            {openSection === "category" &&
              categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.optionItem}
                  onPress={() => {
                    setCategory(c.nombre);
                    setOpenSection(null);
                  }}
                >
                  <Text style={styles.optionText}>{c.nombre}</Text>
                </TouchableOpacity>
              ))}

            {/* Duración */}
            <TouchableOpacity
              style={styles.row}
              onPress={() => toggle("duration")}
            >
              <Text style={styles.rowText}>
                {startDateObj
                  ? `De ${startDateObj.toLocaleDateString()}`
                  : "Escoger fecha de duración"}
                {startDateObj && !hasEnd ? " - Continuo" : ""}
                {endDateObj && hasEnd
                  ? ` - ${endDateObj.toLocaleDateString()}`
                  : ""}
              </Text>
              <View style={styles.arrowCircle}>
                <Feather
                  name={
                    openSection === "duration"
                      ? "chevron-down"
                      : "chevron-right"
                  }
                  size={18}
                  color="#000"
                />
              </View>
            </TouchableOpacity>
            {openSection === "duration" && (
              <View style={styles.subContainer}>
                {/* Fecha inicio */}
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.rowText}>
                    {startDateObj
                      ? startDateObj.toLocaleDateString()
                      : "Seleccionar fecha de inicio"}
                  </Text>
                  <View style={styles.arrowCircle}>
                    <Feather name="chevron-right" size={18} color="#000" />
                  </View>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={startDateObj || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={(_, d) => {
                      setShowStartPicker(false);
                      if (Platform.OS === "android" && _.type === "dismissed")
                        return;
                      d && setStartDateObj(d);
                    }}
                  />
                )}

                {/* Checkbox final */}
                {startDateObj && (
                  <View style={styles.row}>
                    <Text style={styles.rowText}>Tiene fecha final</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setHasEnd(!hasEnd);
                        if (hasEnd) setEndDateObj(null);
                      }}
                    >
                      <Feather
                        name={hasEnd ? "check-square" : "square"}
                        size={18}
                        color="#B6F2DC"
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Fecha final */}
                {hasEnd && (
                  <>
                    <TouchableOpacity
                      style={styles.row}
                      onPress={() => setShowEndPicker(true)}
                    >
                      <Text style={styles.rowText}>
                        {endDateObj
                          ? endDateObj.toLocaleDateString()
                          : "Seleccionar fecha final"}
                      </Text>
                      <View style={styles.arrowCircle}>
                        <Feather name="chevron-right" size={18} color="#000" />
                      </View>
                    </TouchableOpacity>
                    {showEndPicker && (
                      <DateTimePicker
                        value={endDateObj || new Date()}
                        mode="date"
                        display="spinner"
                        onChange={(_, d) => {
                          setShowEndPicker(false);
                          if (
                            Platform.OS === "android" &&
                            _.type === "dismissed"
                          )
                            return;
                          if (d) {
                            if (startDateObj && d <= startDateObj) {
                              Alert.alert(
                                "Error",
                                "La fecha final debe ser mayor a la de inicio."
                              );
                              setEndDateObj(null);
                            } else {
                              setEndDateObj(d);
                            }
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </View>
            )}

            {/* Frecuencia */}
            <TouchableOpacity
              style={styles.row}
              onPress={() => toggle("frequency")}
            >
              <Text style={styles.rowText}>
                {frequency || "Escoger una frecuencia de ahorro"}
              </Text>
              <View style={styles.arrowCircle}>
                <Feather
                  name={
                    openSection === "frequency"
                      ? "chevron-down"
                      : "chevron-right"
                  }
                  size={18}
                  color="#000"
                />
              </View>
            </TouchableOpacity>
            {openSection === "frequency" &&
              frequencies.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={styles.optionItem}
                  onPress={() => {
                    setFrequency(f);
                    setOpenSection(null);
                  }}
                >
                  <Text style={styles.optionText}>{f}</Text>
                </TouchableOpacity>
              ))}

            {/* Inputs */}
            <TextInput
              style={styles.input}
              placeholder="Escribe el monto $$$ meta"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              value={valueMeta}
              onChangeText={(t) => setValueMeta(formatWithDots(t))}
            />
            <TextInput
              style={styles.input}
              placeholder="Escribe cuánto llevas ahorrado $$$"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              value={valueSaved}
              onChangeText={(t) => setValueSaved(formatWithDots(t))}
            />
            <TextInput
              style={styles.input}
              placeholder="Escribe un nombre para tu meta"
              placeholderTextColor="#ccc"
              value={name}
              onChangeText={setName}
            />

            {/* Botón guardar */}
            <TouchableOpacity
              style={[styles.primaryButton, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Feather
                  name={mode === "add" ? "plus" : "check"}
                  size={18}
                  color="#000"
                />
              )}
              <Text style={styles.primaryText}>
                {mode === "add" ? "Agregar meta" : "Guardar cambios"}
              </Text>
            </TouchableOpacity>

            {/* Botón cancelar */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                sheetRef.current.hide();
                onCancel?.();
              }}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ActionSheet>
  );
});

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: "#2A3038",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  container: { padding: 20 },
  title: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "SpaceGroteskBold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rowText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  subContainer: {
    paddingLeft: 16,
    marginBottom: 12,
  },
  optionItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4A4A4A",
    marginBottom: 8,
  },
  optionText: {
    color: "#FFF",
    fontFamily: "SpaceGroteskRegular",
  },
  input: {
    backgroundColor: "#242A2C",
    color: "#FFF",
    borderColor: "#363E40",
    borderWidth: 2,
    borderRadius: 8,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 16,
    marginBottom: 12,
    fontFamily: "SpaceGroteskRegular",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B6F2DC",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  primaryText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "SpaceGroteskBold",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 4,
  },
  cancelText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
});

export default AddEditGoalActionSheet;
