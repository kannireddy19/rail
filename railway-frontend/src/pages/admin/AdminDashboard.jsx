// src/pages/admin/AdminDashboard.jsx

import { useNavigate } from 'react-router-dom';
import '../../css/admin/AdminDashboard.css'; // ✅ Corrected path
import { FaUsers, FaTrain, FaUserCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

function AdminDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('username');
    if (name) {
      setUsername(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          {username && (
            <h2 className="welcome-message">
              WELCOME <span className="username-highlight">{username.toUpperCase()}</span>
            </h2>
          )}
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="cards-container">
        <div className="card" onClick={() => handleCardClick('/admin-profile')}>
          <FaUserCircle className="card-icon" />
          <h2>Profile</h2>
        </div>
        <div className="card" onClick={() => handleCardClick('/admin-users')}>
          <FaUsers className="card-icon" />
          <h2>Users</h2>
        </div>
        <div className="card" onClick={() => handleCardClick('/admin/trains')}>
          <FaTrain className="card-icon" />
          <h2>Trains</h2>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
