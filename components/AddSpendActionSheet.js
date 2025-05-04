import React, { useState, useEffect, useImperativeHandle, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import ActionSheet from "react-native-actions-sheet";
import { db } from "../firebase/config";
import { useFonts } from "expo-font";
import {
  getDocs,
  getDoc,
  collection,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../contexts/AuthContext";

const formatWithDots = (value) => {
  const numeric = value.replace(/\D/g, "");
  return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const AddSpendActionSheet = React.forwardRef(
  ({ gasto, onSaveSuccess, onCancel }, ref) => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [fecha, setFecha] = useState("");
    const { currentUser } = useAuth();
    const email = currentUser?.email || "";

    const [openSection, setOpenSection] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const internalRef = useRef();
    
    const [loaded, error] = useFonts({
      SpaceGroteskBold: require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
      SpaceGroteskRegular: require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
    });

    useEffect(() => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]);

    useEffect(() => {
      if (gasto) {
        setAmount(gasto.amount.toString());
        setName(gasto.name);
      }
    }, [gasto]);

    useImperativeHandle(ref, () => ({
      show: async () => {
        
        setLoading(true);

        try {
          const snap = await getDocs(collection(db, "categoria")).catch(e => {
            console.error("[Error] En getDocs(categoria):", e);
            throw e;
          });

          setCategories(
            snap.docs.map((d) => ({ id: d.id, nombre: d.data().nombre }))
          );

        } catch (e) {
          console.error("Error cargando categorías:", e);
        } finally {
          setLoading(false);
        }
    
        internalRef.current?.show();
      },
      hide: () => {
        internalRef.current?.hide();
      },
      reload: () => {
        setCategory("");
        setAmount("");
        setName("");
        setFecha("");
      }
    }));

    const handleSaveSpend = async () => {
      if (!amount || !name || !category) {
        Alert.alert("Error", "Completa todos los campos");
        return;
      }
    
      try {
        setSaving(true);
        
        // Guardar como nuevo documento en la colección (auto-ID)
        await addDoc(collection(db, "gestion_gasto"), {
          usuario: email,  // Campo separado (no como ID)
          amount: parseFloat(amount),
          name: name,
          category: category,
          date: new Date()  // Fecha actual automática
        });
    
        Alert.alert("Éxito", "Gasto registrado");
        internalRef.current?.hide();
        onSaveSuccess?.(); // Recargar la lista de gastos
      } catch (error) {
        console.error("Error guardando:", error);
        Alert.alert("Error", "No se pudo guardar. Error: " + error.message);
      } finally {
        setSaving(false);
      }
    };

    useEffect(() => {
      if (gasto) {
        setAmount(gasto.amount?.toString() || '');
        setName(gasto.name || '');
        setCategory(gasto.category || '');
        setFecha(gasto.date ? formatDate(gasto.date) : '');
      } else {  
        setAmount('');
        setName('');
        setCategory('');
        setFecha('');
      }
    }, [gasto]);

    const toggle = (section) => {
      setOpenSection(openSection === section ? null : section);
    };

    if (!loaded && !error) return null;

    const formatDate = (date) => {
      return date.toLocaleDateString('es-ES');
    };

    //BORRAR AHORITA
    useEffect(() => {
      console.log("ActionSheet montado"); // Debe aparecer en consola al cargar la pantalla
    }, []);

    return (
      <ActionSheet ref={internalRef}
        containerStyle={styles.sheetContainer}
        keyboardHandlerEnabled={false}
        maskEnabled={false}
        closeOnDragDown={false}
        gestureEnabled={false}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.content}>
          <Text style={styles.title}>Agregar gasto nuevo</Text>

          {loading ? (
            <ActivityIndicator
              color="#B6F2DC"
              size="large"
              style={{ marginVertical: 20 }}
            />
          ):(<>
          {/* Categoría */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => toggle("category")}
          >
            <Text style={styles.rowText}>
              {category || "Escoger categoría de gasto"}
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

          <TextInput
            style={styles.input}
            placeholder="Escribe el monto gastado $$$"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <TextInput
            style={styles.input}
            placeholder="Describe en que gastaste el dinero"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleSaveSpend}
            disabled={saving}
          >
            <Feather name="plus" size={18} color="#1E2429" />
            <Text style={styles.addButtonText}>
              {saving ? "Guardando..." : "+ Agregar gasto"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => ref?.current?.hide()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          </>
            )}
          </View>
        </ScrollView>
      </ActionSheet>
    );
  }
);

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: "#2A3038",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "SpaceGroteskBold",
  },
  input: {
    backgroundColor: "#1E2429",
    color: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontFamily: "SpaceGroteskRegular",
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
  addButton: {
    backgroundColor: "#B6F2DC",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#1E2429",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    fontFamily: "SpaceGroteskBold",
  },
  cancelButton: {
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SpaceGroteskRegular",
  },
});


export default AddSpendActionSheet;