// src/components/admin/TrainList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/admin/TrainList.css';

export default function TrainList() {
  const [trains, setTrains] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrains();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchTrains = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:8086/traininfo/trains/getall', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setTrains(data);
    } catch (err) {
      setError('❌ Failed to fetch trains');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this train?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:8086/traininfo/trains/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (res.ok) {
        setSuccess('✅ Train deleted successfully');
        setTrains(trains.filter((train) => train.id !== id));
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      setError('❌ Failed to delete train');
      console.error(err);
    }
  };

  return (
    <div className="train-list-container">
      <button className="back-button" onClick={() => navigate('/admin/trains')}>
        ← Back
      </button>
      <h2>Trains List</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="train-cards">
        {trains.length === 0 && <p>No trains available.</p>}
        {trains.map((train) => (
          <div className="train-card" key={train.id}>
            <h3>{train.trainName}</h3>
            <p>
              <strong>Number:</strong> {train.trainNumber}
            </p>
            <p>
              <strong>Route:</strong> {train.source} → {train.destination}
            </p>
            <p>
              <strong>Departure:</strong> {train.departureDate} {train.departureTime}
            </p>
            <p>
              <strong>Arrival:</strong> {train.arrivalDate} {train.arrivalTime}
            </p>
            <p>
              <strong>Total Seats:</strong> {train.totalSeats} | <strong>Available:</strong>{' '}
              {train.availableSeats}
            </p>
            <p>
              <strong>Running Days:</strong> {train.runningDays}
            </p>
            <div className="class-prices">
              <strong>Class Prices:</strong>
              <ul>
                {Object.entries(train.classPrices).map(([cls, price]) => (
                  <li key={cls}>
                    {cls}: ₹{price}
                  </li>
                ))}
              </ul>
            </div>
            <div className="actions">
              <button onClick={() => navigate(`/admin/trains/edit/${train.id}`)} className="edit-button">
                Edit
              </button>
              <button onClick={() => handleDelete(train.id)} className="delete-button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
