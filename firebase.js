// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC6Xb00ZL0u6D7GvfKFu8-whV5Z0TJVvpg',
  authDomain: 'budgetbridge-1.firebaseapp.com',
  projectId: 'budgetbridge-1',
  storageBucket: 'budgetbridge-1.firebasestorage.app',
  messagingSenderId: '1010220322602',
  appId: '1:1010220322602:web:b0b776ac016b14889b9853',
  measurementId: 'G-EPRYJX2YTD',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
