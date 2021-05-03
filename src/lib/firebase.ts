import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDxwUgSi7JkPnCD7YnpWEA2oD8vf-q-_Vg',
  authDomain: 'nxt-fire.firebaseapp.com',
  projectId: 'nxt-fire',
  storageBucket: 'nxt-fire.appspot.com',
  messagingSenderId: '847461682918',
  appId: '1:847461682918:web:4d124e392a2caf1321f527',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
