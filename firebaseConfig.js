// Configuración de Firebase para PowerCar
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC3RJ2fa88MUHwY2lmZpw2h9s7IEhHoFBY",
  authDomain: "powercar-603c3.firebaseapp.com",
  databaseURL: "https://powercar-603c3-default-rtdb.firebaseio.com/",
  projectId: "powercar-603c3",
  storageBucket: "powercar-603c3.appspot.com",
  messagingSenderId: "231275592149",
  appId: "1:231275592149:android:0709220fa5525fb859255c"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
