import firebase from 'firebase/app';
import { useDocument } from 'react-firebase-hooks/firestore';
import { auth, firestore, increment } from '../lib/firebase';

interface HeartProps {
  postRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
}

// Allows users to heart or like a post
const HeartButton = ({ postRef }: HeartProps) => {
  // listen to heart document for currently logged in user
  const heartRef = postRef.collection('hearts').doc(auth.currentUser?.uid);
  const [heartDoc] = useDocument(heartRef);

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser?.uid;
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
};

export default HeartButton;