import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCIb-dwp0wYBw6Py2Zn7h_mut5uEmVzS8c",
  authDomain: "smartcare-52eee.firebaseapp.com",
  projectId: "smartcare-52eee",
  storageBucket: "smartcare-52eee.firebasestorage.app",
  messagingSenderId: "356266877256",
  appId: "1:356266877256:web:fbff9d8f88ddb5f48fd37d",
  measurementId: "G-MRPJK0H4S8"
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
