import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Post } from '../types';

interface PostContentProps {
  post: Post | null;
}

const PostContent = ({ post }: PostContentProps) => {
  if (post === null) {
    return <h3>Post doesn&apos;t exist</h3>;
  }

  const createdAt = new Date(post.createdAt);

  return (
    <div className='card'>
      <h1>{post.title}</h1>
      <span className='text-sm'>
        Written by{' '}
        <Link href={`/${post.username}`}>
          <a className='text-info'>@{post.username}</a>
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
};

export default PostContent;
