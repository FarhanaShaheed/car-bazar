import { initializeApp } from "firebase/app";
//import firebaseConfig from "./firebase.config";
import firebaseConfig from './Firebase.config';

const initializeFirebase = () =>{
    initializeApp(firebaseConfig);
}

export default initializeFirebase;