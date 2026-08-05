import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBp1o27DuxjSkHxaLaEQzAPrM5BiCKih5Y",
  authDomain: "pop-onion.firebaseapp.com",
  projectId: "pop-onion",
  storageBucket: "pop-onion.firebasestorage.app",
  messagingSenderId: "722915379793",
  appId: "1:722915379793:web:729ef539b4fbda7c510670",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
