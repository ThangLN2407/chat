// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA0KMElLuUoAu_x-8ZzzcXEoMtFJ6BbQP0",
  authDomain: "realtime-chat-5a748.firebaseapp.com",
  projectId: "realtime-chat-5a748",
  storageBucket: "realtime-chat-5a748.firebasestorage.app",
  messagingSenderId: "961053510211",
  appId: "1:961053510211:web:1dfe11a84ef6b0db7e62f6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
