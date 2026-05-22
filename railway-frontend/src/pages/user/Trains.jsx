// src/pages/user/Trains.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/user/Trains.css';

function Trains() {
  const [trains, setTrains] = useState([]);
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('jwtToken');

  // Function to format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchAllTrains = async () => {
    try {
      const res = await fetch('http://localhost:8086/traininfo/trains/getall', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTrains(data);
      setMessage('✅ All trains loaded');
    } catch (err) {
      setMessage('❌ Failed to load trains');
    }
  };

  const searchTrains = async () => {
    if (!source || !destination) return setMessage('❗ Enter both source and destination');
    try {
      const res = await fetch(
        `http://localhost:8086/traininfo/trains/search?source=${source}&destination=${destination}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error('No trains found');
      const data = await res.json();

      if (data.length === 0) {
        setMessage(`❌ Trains not found between ${source} and ${destination}`);
      } else {
        setTrains(data);
        setMessage(`✅ Trains from ${source} to ${destination}`);
      }
    } catch (err) {
      setTrains([]);
      setMessage(`❌ Trains not found between ${source} and ${destination}`);
    }
  };

  const handleTrainClick = (train) => {
    const confirmBooking = window.confirm(`Proceed to book ${train.trainName} (${train.trainNumber})?`);
    if (confirmBooking) {
      navigate('/reservations/book', { state: { train } });
    }
  };

  return (
    <div className="trains-wrapper">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

      <h2 className="trains-title">Trains</h2>

      <div className="trains-search-bar">
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button onClick={searchTrains}>Search</button>
      </div>

      <div className="train-controls">
        <button onClick={fetchAllTrains}>Get All Trains</button>
      </div>

      {message && <div className="train-message">{message}</div>}

      <div className="train-card-container">
        {trains.map((train) => (
          <div
            className="train-card"
            key={train.id}
            onClick={() => handleTrainClick(train)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{train.trainName} ({train.trainNumber})</h3>
            <p><strong>Train Name:</strong> {train.trainName}</p>
            <p><strong>Train Number:</strong> {train.trainNumber}</p>
            <p><strong>Source:</strong> {train.source}</p>
            <p><strong>Destination:</strong> {train.destination}</p>
            <p><strong>Departure:</strong> {formatDate(train.departureDate)} at {train.departureTime}</p>
            <p><strong>Arrival:</strong> {formatDate(train.arrivalDate)} at {train.arrivalTime}</p>
            <p><strong>Available Seats:</strong> {train.availableSeats}/{train.totalSeats}</p>
            
            <div className="class-prices">
              <strong>Prices:</strong>
              <ul>
                {Object.entries(train.classPrices).map(([cls, price]) => (
                  <li key={cls}>{cls.replace('_', ' ')}: ₹{price}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trains;