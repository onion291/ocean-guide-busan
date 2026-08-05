import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOv_VYHIpP9tBjrGfyoCFriOslNUId22Q",
  authDomain: "ocean-guide-15309.firebaseapp.com",
  projectId: "ocean-guide-15309",
  storageBucket: "ocean-guide-15309.firebasestorage.app",
  messagingSenderId: "804526260733",
  appId: "1:804526260733:web:d520b99b12802b13691994",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);
