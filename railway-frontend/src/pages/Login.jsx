// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, loginAdmin } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import '../css/Login.css';

function Login() {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Reset form when role changes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let token;

      if (role === 'user') {
        token = await loginUser({ username: email, password });

        const decoded = jwtDecode(token);
        const userId = decoded?.userId;
        if (!userId) throw new Error('Invalid user token');

        localStorage.setItem('jwtToken', token);
        localStorage.setItem('username', email);
        localStorage.setItem('userId', userId);

        navigate('/user-dashboard');
      } else {
        token = await loginAdmin({ username: email, password });

        const decoded = jwtDecode(token);
        const adminId = decoded?.adminId;
        if (!adminId) throw new Error('Invalid admin token');

        localStorage.setItem('jwtToken', token);
        localStorage.setItem('username', email);
        localStorage.setItem('adminId', adminId);

        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <button onClick={() => navigate('/')} className="home-button">Home</button>
      <h2>LOGIN</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="login-role"
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="text"
          placeholder="User Name"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />

        <button
          type="submit"
          className={`loginpage-button ${role === 'admin' ? 'admin-login' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {role === 'user' && (
        <p className="register-link">
          Don't have an account? <Link to="/register">Register as User</Link>
        </p>
      )}
    </div>
  );
}

export default Login;
