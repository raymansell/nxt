import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { User, Post } from '../types';

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

// Helper functions

/*
  Transforms objects of type T into Firestore data and vice versa.
*/
export const converter = <T>() => ({
  toFirestore(data: T) {
    return data;
  },
  fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot): T {
    return snapshot.data() as T;
  },
});

/*
  Gets a user/{uid} document with username
  @param {string} username
*/
export const getUserWithUsername = async (username: string) => {
  const usersRef = firestore
    .collection('users')
    .withConverter(converter<User>());
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0]; // undefined if username doesn't exist
  return userDoc;
};

/*
  Converts a Firestore Post document to JSON
  @param {DocumentSnapshot} doc
*/

export const postToJSON = (
  doc: firebase.firestore.QueryDocumentSnapshot<Post>
): Post => {
  const data = doc.data();
  return {
    ...data,
    // Firestore timestamp are NOT serializable to JSON. Must convert to milliseconds.
    createdAt: doc.get('createdAt').toMillis() as number,
    updatedAt: doc.get('updatedAt').toMillis() as number,
  };
};
