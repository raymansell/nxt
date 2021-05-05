import { User } from '../types';

interface UserProfileProps {
  user: User | null;
}

const UserProfile = ({ user }: UserProfileProps) => {
  if (user === null) {
    return <div>that user does not exist</div>;
  }
  return (
    <div>
      <img src={user.photoURL} alt='user profile' />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
};

export default UserProfile;
