import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/user/BookReservation.css';

const BookReservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trainData = location.state?.train || {};
  const readOnlyMode = location.state?.readOnly || false;

  const [formData, setFormData] = useState({
    source: trainData.source || '',
    destination: trainData.destination || '',
    departureDate: trainData.departureDate || '',
    coachType: '',
    passengers: [{ name: '', age: '', gender: '', seatPreference: '' }],
  });

  const coachTypes = ['FIRST_AC', 'SECOND_AC', 'THIRD_AC', 'SLEEPER', 'GENERAL'];

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;
    if (index !== null && field !== null) {
      const updatedPassengers = [...formData.passengers];
      updatedPassengers[index][field] = value;
      setFormData({ ...formData, passengers: updatedPassengers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addPassenger = () => {
    setFormData({
      ...formData,
      passengers: [...formData.passengers, { name: '', age: '', gender: '', seatPreference: '' }],
    });
  };

  const removePassenger = (index) => {
    const updatedPassengers = [...formData.passengers];
    updatedPassengers.splice(index, 1);
    setFormData({ ...formData, passengers: updatedPassengers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Please log in first');
      return;
    }

    try {
      const response = await fetch('http://localhost:8086/reservation-service/reservations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        const proceed = window.confirm(
          `Reservation successful! Your Reservation ID: ${result.resId}\n\nProceed to payment?`
        );

        if (proceed) {
          navigate('/user/payments', {
            state: {
              resId: result.resId,
              amount: result.totalFare,
            },
          });
        }
      } else if (response.status === 401) {
        alert('Unauthorized. Please log in again.');
      } else {
        alert('Reservation failed.');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('An error occurred while creating reservation.');
    }
  };

  const handleBack = () => navigate('/reservations');

  return (
    <div className="reservation-form-container">
      <button onClick={handleBack} className="back-button">Back</button>
      <h2>Book Reservation</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-group">
          <label>Source:</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
            readOnly={readOnlyMode}
          />
        </div>
        <div className="form-group">
          <label>Destination:</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            readOnly={readOnlyMode}
          />
        </div>
        <div className="form-group">
          <label>Departure Date:</label>
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Coach Type:</label>
          <select name="coachType" value={formData.coachType} onChange={handleChange} required>
            <option value="">Select Coach</option>
            {coachTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <h4>Passengers:</h4>
        {formData.passengers.map((passenger, index) => (
          <div key={index} className="passenger-group">
            <input
              type="text"
              placeholder="Name"
              value={passenger.name}
              onChange={(e) => handleChange(e, index, 'name')}
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={passenger.age}
              onChange={(e) => handleChange(e, index, 'age')}
              required
            />
            <select
              value={passenger.gender}
              onChange={(e) => handleChange(e, index, 'gender')}
              required
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={passenger.seatPreference}
              onChange={(e) => handleChange(e, index, 'seatPreference')}
              required
            >
              <option value="">Seat Preference</option>
              <option value="Window">Window</option>
              <option value="Aisle">Aisle</option>
              <option value="Middle">Middle</option>
            </select>
            {formData.passengers.length > 1 && (
              <button
                type="button"
                className="remove-passenger-btn"
                onClick={() => removePassenger(index)}
              >
                ❌ Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addPassenger} className="add-passenger-btn">+ Add Passenger</button>
        <button type="submit" className="submit-btn">🎫 Book</button>
      </form>
    </div>
  );
};

export default BookReservation;
