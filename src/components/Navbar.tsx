import Link from 'next/link';
import { useUserData } from '../context/UserContext';

const Navbar = () => {
  const { user, username } = useUserData();

  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link href='/'>
            <button className='btn-logo'>NXT</button>
          </Link>
        </li>
        {/* user is signed-in and has username */}
        {username && (
          <>
            <li className='push-left'>
              <button>Sign Out</button>
            </li>
            <li>
              <Link href='/admin'>
                <button className='btn-blue'>Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL || '/hacker.png'} alt='profile pic' />
              </Link>
            </li>
          </>
        )}
        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href='/enter'>
              <button className='btn-blue'>Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
