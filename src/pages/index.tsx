import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Post } from '../types';
import { firestore, converter, postToJSON, fromMillis } from '../lib/firebase';
import Loader from '../components/Loader';
import PostFeed from '../components/PostFeed';
import Metatags from '../components/Metatags';

// Max posts to query per page
const LIMIT = 5;

export const getServerSideProps: GetServerSideProps = async () => {
  const postsQuery = firestore
    .collectionGroup('posts')
    .withConverter(converter<Post>())
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);
  return {
    props: { posts },
  };
};

interface HomeProps {
  posts: Post[];
}

export default function Home(props: HomeProps) {
  // eslint-disable-next-line react/destructuring-assignment
  const [posts, setPosts] = useState<Post[]>(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    // createdAt is always a number, due to our postToJSON method. But we need it to be a
    // Firestore timestamp in order to query the DB for pagination.
    const cursor = fromMillis(last.createdAt);

    const query = firestore
      .collectionGroup('posts')
      .withConverter(converter<Post>())
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts: Post[] = (await query.get()).docs.map(postToJSON);

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <Metatags
        title='Home Page'
        description='Get the latest posts on our site'
      />
      <div className='card card-info'>
        <h2>💡 Next.js + Firebase blogging platform.</h2>
        <p>
          Welcome! This app is built with Next.js and Firebase and is loosely
          inspired by Dev.to.
        </p>
        <p>
          All public content is server-rendered and search-engine optimized.
        </p>
      </div>

      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  );
}
