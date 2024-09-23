// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWnUEhBxcha7aHhffst3m9_1I1ozFmKA4",
  authDomain: "inventario-7f1b1.firebaseapp.com",
  projectId: "inventario-7f1b1",
  storageBucket: "inventario-7f1b1.appspot.com",
  messagingSenderId: "241597655529",
  appId: "1:241597655529:web:ef5950e1e1de5a03754378"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;