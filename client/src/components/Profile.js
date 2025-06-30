
import './Profile.css';

const Profile = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="user-info" style={{ marginBottom: '20px' }}>
      <h2>{profile.username}'s Profile</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>User ID:</strong> {profile._id}</p>
    </div>
  );
};

export default Profile;
