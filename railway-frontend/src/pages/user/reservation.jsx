import { useNavigate } from 'react-router-dom';
import '../../css/user/reservation.css';

function Reservation() {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleBack = () => {
    navigate('/user-dashboard', { replace: true }); // fixed path to dashboard
  };

  return (
    <div className="reservation-options-container">
      <h2>Reservation Options</h2>

      <button className="back-button" onClick={handleBack}>Back</button>

      <div className="reservation-cards">
        <div className="reservation-card" onClick={() => handleCardClick('/reservations/book')}>
          <h3>📘 Book Tickets</h3>
          <p>Create a new reservation with train and passenger details.</p>
        </div>
        <div className="reservation-card" onClick={() => handleCardClick('/reservations/status')}>
          <h3>🔍 Check Status</h3>
          <p>View reservation details using ResId or PNR.</p>
        </div>
        <div className="reservation-card" onClick={() => handleCardClick('/reservations/cancel')}>
          <h3>❌ Cancel Reservation</h3>
          <p>Delete a reservation using ResId or PNR.</p>
        </div>
        <div className="reservation-card" onClick={() => handleCardClick('/reservations/my-bookings')}>
          <h3>📋 My Bookings</h3>
          <p>View all your reservation history.</p>
        </div>
      </div>
    </div>
  );
}

export default Reservation;
