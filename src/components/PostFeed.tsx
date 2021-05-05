import { Post } from '../types';

interface PostItemProps {
  post: Post;
}

const PostItem = ({ post }: PostItemProps) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>Created by: {post.username}</p>
      <p>{post.content}</p>
      <p>{post.heartCount} hearts</p>
    </div>
  );
};

interface PostFeedProps {
  posts: Post[] | null;
}

const PostFeed = ({ posts }: PostFeedProps) => {
  return posts ? (
    <>
      {posts.map((post) => (
        <PostItem key={post.slug} post={post} />
      ))}
    </>
  ) : null;
};

export default PostFeed;
