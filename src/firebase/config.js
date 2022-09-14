import { initializeApp } from 'firebase/app';

import { getAuth, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: 'movie-c440c.firebaseapp.com',
    projectId: 'movie-c440c',
    storageBucket: 'movie-c440c.appspot.com',
    messagingSenderId: '1025271130263',
    appId: '1:1025271130263:web:48babbb9328a39da0361d2',
    measurementId: 'G-1LLZLW57QS',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const fbProvider = new FacebookAuthProvider();

export const ggProvider = new GoogleAuthProvider();
