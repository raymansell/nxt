import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import {
  firestore,
  getUserWithUsername,
  converter,
  postToJSON,
} from '../../lib/firebase';
import { Post } from '../../types';

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

  if (userDoc) {
    const postRef = userDoc.ref
      .collection('posts')
      .withConverter(converter<Post>())
      .doc(slug);
    const postDoc = await postRef.get();

    if (postDoc.exists) {
      post = postToJSON(postDoc);
    }
  }

  return {
    props: { post },
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
}

const PostPage = ({ post }: PostPageProps) => {
  return (
    <main>
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <p>{post.heartCount} hearts</p>
        </>
      ) : (
        <h1>post doesn&apos;t exist</h1>
      )}
    </main>
  );
};

export default PostPage;
