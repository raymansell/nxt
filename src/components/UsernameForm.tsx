import debounce from 'lodash.debounce';
import React, { useState, useEffect, useMemo } from 'react';
import { useUserData } from '../context/UserContext';
import { firestore } from '../lib/firebase';

interface UsernameMessageProps {
  username: string | null;
  isValid: boolean;
  loading: boolean;
}

const UsernameMessage = ({
  username,
  isValid,
  loading,
}: UsernameMessageProps) => {
  if (loading) {
    return <p>Checking...</p>;
  }
  if (isValid) {
    return <p className='text-success'>{username} is available!</p>;
  }
  if (username && !isValid) {
    return <p className='text-danger'>That username is taken!</p>;
  }
  return null;
};

const UsernameForm = () => {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useUserData();

  // Hit the database for username match after each debounced change
  // (Memoizing the funtion returned by debounce() is required for the debounce to work, and useCallback throws a linting error)
  const checkUsername = useMemo(
    () =>
      debounce(async (usernameToCheck: string) => {
        if (usernameToCheck.length >= 3) {
          const ref = firestore.doc(`usernames/${usernameToCheck}`);
          const { exists } = await ref.get();
          console.log('Firestore read executed!');
          setIsValid(!exists);
          setLoading(false);
        }
      }, 500),
    []
  );

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue, checkUsername]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    // Force form value typed in form to match correct format
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Creates refs for both documents
    const userDoc = firestore.doc(`users/${user?.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user?.photoURL,
      displayName: user?.displayName,
    });
    batch.set(usernameDoc, { uid: user?.uid });

    // Note that signing in with Google is not enough to be registered. To be correctly registered in
    // both collections (user, username) of Firestore DB one needs to be signed-in and have selected an available username.

    await batch.commit();
  };

  return username ? null : (
    <section>
      <h3>Choose Username</h3>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          name='username'
          placeholder='username'
          value={formValue}
          onChange={onChange}
        />
        <UsernameMessage
          username={formValue}
          isValid={isValid}
          loading={loading}
        />
        <button type='submit' className='btn-green' disabled={!isValid}>
          Choose
        </button>
        <h3>Debug state</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username valid: {isValid.toString()}
        </div>
      </form>
    </section>
  );
};

export default UsernameForm;
