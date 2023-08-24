import { initializeApp } from "firebase/app";
import{getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAKWRNphK4Bq2oqbv5sYZ5BQLj3SsI2dwo",
    authDomain: "e-library-121fc.firebaseapp.com",
    projectId: "e-library-121fc",
    storageBucket: "e-library-121fc.appspot.com",
    messagingSenderId: "323376869224",
    appId: "1:323376869224:web:d3e82614dbc58202ccf0dd"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db=getFirestore(app)
  export default db;