import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC6Xb00ZL0u6D7GvfKFu8-whV5Z0TJVvpg',
  authDomain: 'budgetbridge-1.firebaseapp.com',
  projectId: 'budgetbridge-1',
  storageBucket: 'budgetbridge-1.firebasestorage.app',
  messagingSenderId: '1010220322602',
  appId: '1:1010220322602:web:b0b776ac016b14889b9853',
  measurementId: 'G-EPRYJX2YTD',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
