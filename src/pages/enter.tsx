import { auth, googleAuthProvider } from '../lib/firebase';
import { useUserData } from '../context/UserContext';
import UsernameForm from '../components/UsernameForm';
import Metatags from '../components/Metatags';

// Sign in with Google button
const SignInButton = () => {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className='btn-google' onClick={signInWithGoogle}>
      <img src='/google.png' alt='google logo' /> Sign in with Google
    </button>
  );
};

// Sign out button
const SignOutButton = () => {
  return <button onClick={() => auth.signOut()}>Sign out</button>;
};

const EnterPage = () => {
  const { user, username } = useUserData();

  // 1. user signed out · <SignInButton />
  // 2. user signed in, but missing username · <UsernameForm />
  // 3. user signed in, has username · <SignOutButton />
  return (
    <main>
      <Metatags title='Enter' description='Sign up for this amazing app!' />
      {/* eslint-disable-next-line no-nested-ternary */}
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
};

export default EnterPage;
