import React, { useState, useEffect, useImperativeHandle, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import ActionSheet from "react-native-actions-sheet";
import { db } from "../firebase/config";
import { useFonts } from "expo-font";
import { collection, doc, setDoc, getDoc } from "firebase/firestore"; // Añadido getDoc

const AddGoalActionSheet = React.forwardRef(
  ({ email, meta, onSaveSuccess }, ref) => {
    const [valorMeta, setValorMeta] = useState("");
    const [valorAhorrado, setValorAhorrado] = useState("");
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
      if (meta) {
        setValorMeta(meta.valor_meta.toString());
        setValorAhorrado(meta.valor_ahorrado.toString());
      }
    }, [meta]);

    useImperativeHandle(ref, () => ({
      show: async () => {
        if (!email) return;
        try {
          const docRef = doc(db, "meta_ahorro_personal", email);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setValorMeta(String(data.valor_meta));
            setValorAhorrado(String(data.valor_ahorrado));
          } else {
            setValorMeta("");
            setValorAhorrado("");
          }
          internalRef.current?.show();
        } catch (err) {
          console.error("Error cargando datos para edición:", err);
        }
      },
      hide: () => {
        internalRef.current?.hide();
      },
    }));

    const handleSaveGoal = async () => {
      if (!valorMeta || !valorAhorrado) {
        Alert.alert("Error", "Por favor llena ambos campos");
        return;
      }

      try {
        setSaving(true);
        const metaRef = doc(collection(db, "meta_ahorro_personal"), email);

        await setDoc(metaRef, {
          valor_meta: parseFloat(valorMeta),
          valor_ahorrado: parseFloat(valorAhorrado),
          usuario_email: email,
        });

        Alert.alert("Éxito", "¡Meta guardada exitosamente!");

        ref?.current?.hide();
        onSaveSuccess?.();
      } catch (error) {
        console.error("Error al guardar la meta:", error);
        Alert.alert("Error", "Hubo un problema al guardar la meta");
      } finally {
        setSaving(false);
      }
    };

    if (!loaded && !error) return null;

    return (
      <ActionSheet ref={internalRef} containerStyle={styles.sheetContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Agregar meta principal del mes</Text>

          <TextInput
            style={styles.input}
            placeholder="Escribe el monto $$$ meta del mes"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={valorMeta}
            onChangeText={setValorMeta}
          />

          <TextInput
            style={styles.input}
            placeholder="Escribe cuánto llevas ahorrado $$$"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={valorAhorrado}
            onChangeText={setValorAhorrado}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleSaveGoal}
            disabled={saving}
          >
            <Feather name="plus" size={18} color="#1E2429" />
            <Text style={styles.addButtonText}>
              {saving ? "Guardando..." : "Agregar meta mensual"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => ref?.current?.hide()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
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

export default AddGoalActionSheet;
