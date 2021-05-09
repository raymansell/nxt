/* eslint-disable react/require-default-props */
import Link from 'next/link';
import { Post } from '../types';

interface PostItemProps {
  post: Post;
  admin?: boolean;
}

const PostItem = ({ post, admin = false }: PostItemProps) => {
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

      {/* If admin view, show extra constrolls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className='btn-blue'>Edit</button>
            </h3>
          </Link>
          {post.published ? (
            <p className='text-success'>Live</p>
          ) : (
            <p className='text-danger'>Unpublished</p>
          )}
        </>
      )}
    </div>
  );
};

interface PostFeedProps {
  posts: Post[];
  admin?: boolean;
}

const PostFeed = ({ posts, admin = false }: PostFeedProps) => {
  return posts.length > 0 ? (
    <>
      {posts.map((post) => (
        <PostItem key={post.slug} post={post} admin={admin} />
      ))}
    </>
  ) : null;
};

export default PostFeed;
