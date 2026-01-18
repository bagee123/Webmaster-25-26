import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfmiNWQ8cW-ObAWutccgtrmsUk9rnKRJY",
  authDomain: "tsa-website-login-data-storage.firebaseapp.com",
  projectId: "tsa-website-login-data-storage",
  storageBucket: "tsa-website-login-data-storage.firebasestorage.app",
  messagingSenderId: "66424008593",
  appId: "1:66424008593:web:03136ff61d373a30df3430",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();