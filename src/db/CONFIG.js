import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCY20wdUiUbr2O3ptikKKJrIpoz-mWjL8M",
  authDomain: "myvocabspace.firebaseapp.com",
  projectId: "myvocabspace",
  storageBucket: "myvocabspace.appspot.com",
  messagingSenderId: "911874931453",
  appId: "1:911874931453:web:385b6f2fe88e8721099c94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(app);

export default app;