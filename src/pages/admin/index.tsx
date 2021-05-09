import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import kebabCase from 'lodash.kebabcase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { useUserData } from '../../context/UserContext';
import { auth, firestore, serverTimestamp } from '../../lib/firebase';
import { Post } from '../../types';
import styles from '../../styles/Admin.module.css';

const PostList = () => {
  const ref = firestore
    .collection('users')
    .doc(auth.currentUser?.uid)
    .collection('posts');
  const query = ref.orderBy('createdAt');
  const [posts] = useCollectionData<Post>(query);

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts || []} admin />
    </>
  );
};

const CreateNewPost = () => {
  const router = useRouter();
  const { username } = useUserData();
  const [title, setTitle] = useState('');

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate lenth
  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    const ref = firestore
      .collection('users')
      .doc(uid)
      .collection('posts')
      .doc(slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    // Commiting document to Firestore
    await ref.set(data);

    toast.success('Post created!');

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        className={styles.input}
        type='text'
        placeholder='My Awesome Article!'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type='submit' disabled={!isValid} className='btn-green'>
        Create New Post
      </button>
    </form>
  );
};

const AdminPostsPage = () => {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
};

export default AdminPostsPage;
