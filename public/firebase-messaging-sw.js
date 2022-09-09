importScripts('https://www.gstatic.com/firebasejs/<v9+>/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/<v9+>/firebase-messaging-compat.js');

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
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();