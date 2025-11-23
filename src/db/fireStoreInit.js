// Import the necessary modules from firebase-admin
import  { initializeApp, cert } from 'firebase-admin/app';
import  { getFirestore } from 'firebase-admin/firestore';




const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

initializeApp({
  credential: cert(serviceAccount),
   projectId: "testproject-7dfe2", // Optional: Firebase often infers this from the environment
});

const firestoreDb =  getFirestore();


export default firestoreDb;