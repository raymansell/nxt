export interface User {
  displayName: string;
  photoURL: string;
  username: string;
  posts: Post[];
}

export interface Post {
  uid: string;
  content: string;
  createdAt: number;
  heartCount: number;
  published: boolean;
  slug: string;
  title: string;
  updatedAt: number;
  username: string;
}
