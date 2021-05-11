/* eslint-disable react/jsx-props-no-spreading */
import firebase from 'firebase/app';
import { useRouter } from 'next/dist/client/router';
import { ParsedUrlQuery } from 'node:querystring';
import { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import AuthCheck from '../../components/AuthCheck';
import { auth, firestore, serverTimestamp } from '../../lib/firebase';
import { Post } from '../../types';
import styles from '../../styles/Admin.module.css';

interface PostFormProps {
  postRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  defaultValues: Post;
  preview: boolean;
}

const PostForm = ({ postRef, defaultValues, preview }: PostFormProps) => {
  const { register, handleSubmit, watch, reset, formState } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const { isValid, isDirty, errors } = formState;

  const updatePost: SubmitHandler<Post> = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className='card'>
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        <textarea
          {...register('content', {
            required: { value: true, message: 'Content is required' },
            maxLength: { value: 20000, message: 'Content is too long' },
            minLength: { value: 10, message: 'Content is too short' },
          })}
        />

        {errors.content && (
          <p className='text-danger'>{errors.content.message}</p>
        )}

        <fieldset>
          <label htmlFor='published'>
            <input
              id='published'
              className={styles.checkbox}
              type='checkbox'
              {...register('published')}
            />
            Published
          </label>
        </fieldset>

        <button
          type='submit'
          className='btn-green'
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

interface IQuery extends ParsedUrlQuery {
  slug: string;
}

const PostManager = () => {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug } = router.query as IQuery;
  const postRef = firestore
    .collection('users')
    .doc(auth.currentUser?.uid)
    .collection('posts')
    .doc(slug);
  const [realTimePost] = useDocumentData<Post>(postRef);

  return (
    <div className={styles.container}>
      {realTimePost && (
        <>
          <section>
            <h1>{realTimePost.title}</h1>
            <p>ID: {realTimePost.slug}</p>
            <PostForm
              postRef={postRef}
              defaultValues={realTimePost}
              preview={preview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${realTimePost.username}/${realTimePost.slug}`}>
              <button className='btn-blue'>Live View</button>
            </Link>
          </aside>
        </>
      )}
    </div>
  );
};

const AdminPostEdit = () => {
  return (
    <main>
      <AuthCheck>
        <PostManager />
      </AuthCheck>
    </main>
  );
};

export default AdminPostEdit;
