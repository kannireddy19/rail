import { useNavigate } from 'react-router-dom';
import '../../css/user/UserDashboard.css';
import { FaUserCircle, FaTrain, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import { useEffect, useState } from 'react';

function UserDashboard() {
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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>USER DASHBOARD</h1>
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
        <div className="card" onClick={() => handleCardClick('/user-profile')}>
          <FaUserCircle className="card-icon" />
          <h2>Profile</h2>
        </div>
        <div className="card" onClick={() => handleCardClick('/user/trains')}>
  <FaTrain className="card-icon" />
  <h2>Trains</h2>
</div>

        <div className="card" onClick={() => handleCardClick('/reservations')}>
          <FaClipboardList className="card-icon" />
          <h2>Reservation</h2>
        </div>
        <div className="card" onClick={() => handleCardClick('/user/payments')}>
  <FaMoneyBillWave className="card-icon" />
  <h2>Payments</h2>
</div>

      </div>
    </div>
  );
}

export default UserDashboard;
