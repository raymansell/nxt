import Link from 'next/link';
import { Post } from '../types';

interface PostItemProps {
  post: Post;
}

const PostItem = ({ post }: PostItemProps) => {
  // Naive method to calc word count and read time
  const wordCount = post.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className='card'>
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      <Link href={`/${post.username}/${post.slug}`}>
        <a>
          <h2>{post.title}</h2>
        </a>
      </Link>
      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read.
        </span>
        <span className='push-left'>💗 {post.heartCount} Hearts</span>
      </footer>
    </div>
  );
};

interface PostFeedProps {
  posts: Post[];
}

const PostFeed = ({ posts }: PostFeedProps) => {
  return posts.length > 0 ? (
    <>
      {posts.map((post) => (
        <PostItem key={post.slug} post={post} />
      ))}
    </>
  ) : null;
};

export default PostFeed;
