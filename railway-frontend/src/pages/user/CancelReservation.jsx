import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/user/cancel.css';

function CancelReservation() {
  const navigate = useNavigate();

  const [resId, setResId] = useState('');
  const [pnr, setPnr] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCancel = async (type) => {
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('jwtToken');
      const url =
        type === 'resId'
          ? `http://localhost:8086/reservation-service/reservations/delete-by-resId/${resId}`
          : `http://localhost:8086/reservation-service/reservations/delete-by-pnr/${pnr}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Cancellation failed. Please check the ID or PNR.');
      }

      setMessage('Reservation cancelled successfully.');
      setResId('');
      setPnr('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="cancel-container">
      <button className="back-button" onClick={() => navigate('/reservations', { replace: true })}>
        Back
      </button>
      <h2>Cancel Reservation</h2>

      <div className="cancel-group">
        <label>Cancel by Reservation ID:</label>
        <input
          type="text"
          placeholder="Enter Reservation ID"
          value={resId}
          onChange={(e) => setResId(e.target.value)}
        />
        <button onClick={() => handleCancel('resId')}>Cancel by Res ID</button>
      </div>

      <div className="cancel-group">
        <label>Cancel by PNR:</label>
        <input
          type="text"
          placeholder="Enter PNR"
          value={pnr}
          onChange={(e) => setPnr(e.target.value)}
        />
        <small className="pnr-note">ℹ️ Note: PNR-based cancellation works only after payment is completed.</small>
        <button onClick={() => handleCancel('pnr')}>Cancel by PNR</button>
      </div>

      {message && <p className="cancel-success">{message}</p>}
      {error && <p className="cancel-error">{error}</p>}
    </div>
  );
}

export default CancelReservation;
