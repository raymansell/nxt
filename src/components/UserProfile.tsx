import { User } from '../types';

interface UserProfileProps {
  user: User;
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className='box-center'>
      <img src={user.photoURL} alt='user profile' className='card-img-center' />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
};

export default UserProfile;
