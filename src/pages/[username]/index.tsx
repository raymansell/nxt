import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { converter, getUserWithUsername, postToJSON } from '../../lib/firebase';
import PostFeed from '../../components/PostFeed';
import UserProfile from '../../components/UserProfile';
import { User, Post } from '../../types';

interface IParams extends ParsedUrlQuery {
  username: string;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { username } = params as IParams;
  const userDoc = await getUserWithUsername(username);

  // JSON serializable data
  let user: User | null = null;
  let posts: Post[] | null = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection('posts')
      .withConverter(converter<Post>())
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);
  }
  return {
    props: { user, posts },
  };
};

interface UserProfilePageProps {
  user: User;
  posts: Post[];
}

const UserProfilePage = ({ user, posts }: UserProfilePageProps) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
};

export default UserProfilePage;
