import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/user/status.css';

function CheckReservationStatus() {
  const navigate = useNavigate();

  const [resId, setResId] = useState('');
  const [pnr, setPnr] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (type) => {
    setResult(null);
    setError('');
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Please login to view reservation.');
        return;
      }

      const url =
        type === 'resId'
          ? `http://localhost:8086/reservation-service/reservations/get-by-resId/${resId}`
          : `http://localhost:8086/reservation-service/reservations/get-by-pnr/${pnr.trim().toUpperCase()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Reservation not found.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="status-container">
      <button className="back-button" onClick={() => navigate('/reservations', { replace: true })}>
        Back
      </button>
      <h2>Check Reservation Status</h2>

      <div className="status-inputs">
        <div className="status-group">
          <label>Search by Reservation ID:</label>
          <input
            type="text"
            value={resId}
            onChange={(e) => setResId(e.target.value)}
            placeholder="Enter Reservation ID"
          />
          <button onClick={() => handleSearch('resId')}>Check by Res ID</button>
        </div>

        <div className="status-group">
          <label>Search by PNR:</label>
          <input
            type="text"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            placeholder="Enter PNR"
          />
          <small className="pnr-note">ℹ️ Note: PNR search works only after payment is completed.</small>
          <button onClick={() => handleSearch('pnr')}>Check by PNR</button>
        </div>
      </div>

      {error && <p className="status-error">{error}</p>}

      {result && (
        <div className="status-result">
          <h3>Reservation Details</h3>
          <p><strong>Reservation ID:</strong> {result.resId}</p>
          <p><strong>PNR:</strong> {result.pnr || 'Not generated yet'}</p>
          <p><strong>Train:</strong> {result.trainName} ({result.trainNumber})</p>
          <p><strong>From:</strong> {result.source} <strong>To:</strong> {result.destination}</p>
          <p><strong>Departure:</strong> {new Date(result.departureDateTime).toLocaleString()}</p>
          <p><strong>Arrival:</strong> {new Date(result.arrivalDateTime).toLocaleString()}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Coach Type:</strong> {result.coachType}</p>
          <p><strong>No. of Passengers:</strong> {result.numberOfPassengers}</p>
          <p><strong>Total Fare:</strong> ₹{result.totalFare}</p>
          <p><strong>Booking Time:</strong> {new Date(result.bookingDateTime).toLocaleString()}</p>

          <h4>Passengers</h4>
          <ul>
            {result.passengers.map((p, idx) => (
              <li key={idx}>
                {p.name} ({p.gender}, {p.age}) – Seat: {p.seatNumber}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CheckReservationStatus;
