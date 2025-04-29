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
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const AddGoalActionSheet = React.forwardRef(
  ({ email, gasto, onSaveSuccess }, ref) => {
    const [montoGasto, setMontoGasto] = useState("");
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
