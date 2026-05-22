import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/admin/ManageUsers.css';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchUsers = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:8086/user-service/users/all', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('❌ Failed to fetch users');
    }
  };

  const handleDelete = async (userId) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:8086/user-service/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (res.ok) {
        setUsers(users.filter((user) => user.id !== userId));
        setSuccess('✅ User deleted successfully');
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Failed to delete user');
    }
  };

  return (
    <div className="manage-user-page">
      <div className="manage-user-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>Manage Users</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="deleteuser-button" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
