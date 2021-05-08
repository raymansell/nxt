import Link from 'next/link';
import { useUserData } from '../context/UserContext';

interface AuthCheckProps {
  children: React.ReactNode;
}

// Component's children only shown to logged-in users
const AuthCheck = ({ children }: AuthCheckProps) => {
  const { username } = useUserData();
  return username ? (
    <>{children}</>
  ) : (
    <Link href='/enter'>You must be signed in</Link>
  );
};

export default AuthCheck;
