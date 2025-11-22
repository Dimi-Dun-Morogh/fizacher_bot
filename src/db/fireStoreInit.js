// Import the necessary modules from firebase-admin
import  { initializeApp, cert } from 'firebase-admin/app';
import  { getFirestore } from 'firebase-admin/firestore';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { readFileSync } from 'fs';
const __dirname = dirname(fileURLToPath(import.meta.url));


const serviceAccount = JSON.parse(readFileSync( join(__dirname +'../../../service_account.json'), 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
   projectId: "testproject-7dfe2", // Optional: Firebase often infers this from the environment
});

const firestoreDb =  getFirestore();


export default firestoreDb;