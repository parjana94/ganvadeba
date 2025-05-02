import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiE0w1DzHLV9fC3OJtlmeJ-aHUFBgoXKo",
  authDomain: "installmentapp-61f7b.firebaseapp.com",
  projectId: "installmentapp-61f7b",
  storageBucket: "installmentapp-61f7b.firebasestorage.app",
  messagingSenderId: "216307075273",
  appId: "1:216307075273:web:c6c3bed167165054936518"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
