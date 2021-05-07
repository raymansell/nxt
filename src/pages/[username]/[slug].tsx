import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import {
  firestore,
  getUserWithUsername,
  converter,
  postToJSON,
} from '../../lib/firebase';
import { Post } from '../../types';
import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import Metatags from '../../components/Metatags';

interface IParams extends ParsedUrlQuery {
  username: string;
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const snapshot = await firestore
    .collectionGroup('posts')
    .withConverter(converter<Post>())
    .get();
  const paths = snapshot.docs.map((doc) => {
    const { username, slug } = doc.data();
    return { params: { username, slug } };
  });

  return {
    paths,
    fallback: 'blocking', // when a user navigates to a page that was not
    // pre-rendered, this 'blocking' tells Next.js to fall back to regular SSR.
    // Once the new HTML page has been generated, it can be cached in the CDN like all the other pre-rendered pages.
    // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { username, slug } = params as IParams;
  const userDoc = await getUserWithUsername(username);

  let post: Post | null = null;
  let path = '/';

  if (userDoc) {
    const postRef = userDoc.ref
      .collection('posts')
      .withConverter(converter<Post>())
      .doc(slug);
    const postDoc = await postRef.get();

    if (postDoc.exists) {
      post = postToJSON(postDoc);
      path = postRef.path;
    }
  }

  return {
    props: { post, path },
    // (https://reactions-demo.vercel.app/)
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 1 second
    // This also means that a User A potentially sees stale data
    // while User B sees accurate data.
    revalidate: 1, // Incremental Static Regeneration
  };
};

interface PostPageProps {
  post: Post | null;
  path: string;
}

const PostPage = ({ post, path }: PostPageProps) => {
  const postRef = firestore.doc(path);
  const [realTimePost] = useDocumentData<Post>(postRef, {
    // https://github.com/CSFrequency/react-firebase-hooks/blob/master/firestore/README.md#transforming-data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: (val: any) => {
      return {
        ...val,
        createdAt: val.createdAt.toMillis(),
        updatedAt: val.updatedAt.toMillis(),
      };
    },
  });

  const postToShow = realTimePost || post;

  return (
    <main className={styles.container}>
      <Metatags
        title={post?.title || "Oops, post doesn't exist"}
        description={post?.title || "Oops, post doesn't exist"}
      />
      <section>
        <PostContent post={postToShow} />
      </section>

      {post ? (
        <aside className='card'>
          <p>
            <strong>{post.heartCount} 🤍</strong>
          </p>
        </aside>
      ) : null}
    </main>
  );
};

export default PostPage;
