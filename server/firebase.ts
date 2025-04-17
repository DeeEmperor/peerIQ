import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getAnalytics} from "firebase/analytics";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import externalDb from "./firebase";


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export async function getUserDocument(userId: string) {
  const userDocRef = doc(localDb, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    console.log("No such document!");
    return null;
  }
}

// Example: Set a document
export async function setUserDocument(userId: string, data: any) {
  const userDocRef = doc(localDb, "users", userId);
  await setDoc(userDocRef, data);
}

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const localDb = getFirestore(app);
export default app;


