import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/user/Profile.css';
import profilePic from '../../images/user.png'; // Replace with actual image path

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8086/user-service/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Could not fetch user profile');

        const data = await res.json();
        setUser(data);
        setFormData({ ...data, password: '' }); // Don't pre-fill password
      } catch (err) {
        console.error(err);
        setMessage('❌ Could not load user profile');
      }
    };

    fetchUserProfile();
  }, [userId, token]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`http://localhost:8086/user-service/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Update failed');

      const updated = await res.json();
      setUser(updated);
      setEditMode(false);
      setMessage('✅ Profile updated successfully');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8086/user-service/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete account');

      setMessage('✅ Your account was removed successfully. Redirecting to login...');
      localStorage.clear();

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to delete account');
    }
  };

  return (
    <div className="user-profile-wrapper">
      <button className="back-btn" onClick={() => navigate('/user-dashboard')}>← Back</button>
      <div className="user-profile-card">
        <img src={profilePic} alt="User Profile" className="profile-image" />
        <h2>User Profile</h2>

        {message && <div className="profile-message">{message}</div>}

        {user && !editMode ? (
          <div className="profile-info">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <div className="form-buttons">
              <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
              <button className="cancel-btn" onClick={handleDeleteAccount}>Delete Account</button>
              <button className="cancel-btn" onClick={() => navigate('/user-dashboard')}>Cancel</button>
            </div>
          </div>
        ) : (
          editMode && (
            <form className="edit-form" onSubmit={handleUpdate}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter New Password"
                required
              />
              <div className="form-buttons">
                <button type="submit" className="update-btn">Update</button>
                <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
}

export default UserProfile;
