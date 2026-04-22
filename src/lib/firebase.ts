import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCpreVZd-PK4C7X48w07oSS-Y5tcCIiZtk',
  authDomain: 'smartcare-2b4bc.firebaseapp.com',
  projectId: 'smartcare-2b4bc',
  storageBucket: 'smartcare-2b4bc.firebasestorage.app',
  messagingSenderId: '639948862921',
  appId: '1:639948862921:web:7970c1d243182e7beca418',
  measurementId: 'G-FXSB7MZ89T',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
