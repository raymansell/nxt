import AuthCheck from '../../components/AuthCheck';

const AdminPostsPage = () => {
  return (
    <main>
      <AuthCheck>
        <h1>My posts</h1>
      </AuthCheck>
    </main>
  );
};

export default AdminPostsPage;
