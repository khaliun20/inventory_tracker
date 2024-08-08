import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyCl6M2i3b9y4RP-Qog9AlZORG8Gg1nSV04",
 authDomain: "inventory-management-49848.firebaseapp.com",
 projectId: "inventory-management-49848",
 storageBucket: "inventory-management-49848.appspot.com",
 messagingSenderId: "69418078876",
 appId: "G-7MBN8PMEF3"
 };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };