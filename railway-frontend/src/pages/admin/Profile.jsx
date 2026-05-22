import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/admin/Profile.css';
import profilePic from '../../images/admin.png';

function Profile() {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const adminId = localStorage.getItem('adminId');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8086/admin-service/admins/${adminId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Could not fetch admin profile');

        const data = await res.json();
        setAdmin(data);
        setFormData({ ...data, password: '' });
      } catch (err) {
        console.error(err);
        setMessage('❌ Could not load admin profile');
      }
    };

    fetchAdminProfile();
  }, [adminId, token]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000); // Message hides after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`http://localhost:8086/admin-service/admins/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Update failed');

      const updated = await res.json();
      setAdmin(updated);
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

  return (
    <div className="profile-wrapper">
      <button className="back-btn" onClick={() => navigate('/admin-dashboard')}>← Back</button>
      <div className="profile-card">
        <img src={profilePic} alt="Admin Profile" className="profile-image" />
        <h2>Admin Profile</h2>
        
        {message && <div className="profile-message">{message}</div>}

        {admin && !editMode ? (
          <div className="profile-info">
            <p><strong>ID:</strong> {admin.id}</p>
            <p><strong>Username:</strong> {admin.username}</p>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Role:</strong> {admin.role}</p>
            <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
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
                placeholder="Enter Password"
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

export default Profile;
