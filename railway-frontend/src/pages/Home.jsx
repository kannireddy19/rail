import { Link } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="content-box">
        <div className="logo-container"></div>
        <h1 className="app-title">RAIL MITRA</h1>
        <Link to="/login" className="loginHome-button">
          Proceed to Login
        </Link>
      </div>
    </div>
  );
}

export default Home;