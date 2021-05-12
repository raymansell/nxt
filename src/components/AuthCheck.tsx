/* eslint-disable react/require-default-props */
import Link from 'next/link';
import { useUserData } from '../context/UserContext';

interface AuthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Component's children only shown to logged-in users
const AuthCheck = ({ children, fallback }: AuthCheckProps) => {
  const { username } = useUserData();
  return username ? (
    <>{children}</>
  ) : (
    <>{fallback}</> || <Link href='/enter'>You must be signed in</Link>
  );
};

export default AuthCheck;
