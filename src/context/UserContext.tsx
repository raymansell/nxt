import React, { createContext, useContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../lib/firebase';

interface UserContextInterface {
  user: firebase.User | null | undefined; // Firebase's  user object
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

interface UserProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<UserContextInterface | undefined>(undefined);

const UserProvider = ({ children }: UserProviderProps) => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ user, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserData = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  const { user, username, setUsername } = context;

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe: (() => void) | undefined;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      // callback passed to onSnapshot runs everytime the doc in the 'users' db changes
      unsubscribe = ref.onSnapshot((doc) => {
        // This will run after signing up and selecting a username for the first time,
        // effectively updating the state in context to reflect a Navbar UI update.
        // (Note that in that scenario, neither ['user'], nor ['setUsername'] is changing when the UsernameForm is submitted.
        // This callback is being executed because the UsernameForm component is still mounted and the onSnapshot subscription
        // is still active for the last time prior to unmounting).
        setUsername(doc.data()?.username || null);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user, setUsername]);

  return { user, username };
};

export { UserProvider, useUserData };
