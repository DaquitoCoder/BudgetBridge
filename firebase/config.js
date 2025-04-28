import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
} from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyC6Xb00ZL0u6D7GvfKFu8-whV5Z0TJVvpg",
  authDomain: "budgetbridge-1.firebaseapp.com",
  projectId: "budgetbridge-1",
  storageBucket: "budgetbridge-1.firebasestorage.app",
  messagingSenderId: "1010220322602",
  appId: "1:1010220322602:web:b0b776ac016b14889b9853",
  measurementId: "G-EPRYJX2YTD",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Inicializar Auth con persistencia adecuada según la plataforma
const auth = initializeAuth(app, {
  persistence:
    Platform.OS === "web"
      ? browserLocalPersistence
      : getReactNativePersistence(AsyncStorage),
});

export { auth, db };
