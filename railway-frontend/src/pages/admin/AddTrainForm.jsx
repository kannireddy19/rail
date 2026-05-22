import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/admin/AddTrainForm.css';

export default function AddTrainForm() {
  const navigate = useNavigate();

  const initialClassPrices = {
    FIRST_AC: '',
    SECOND_AC: '',
    THIRD_AC: '',
    SLEEPER: '',
    GENERAL: '',
  };

  const [formData, setFormData] = useState({
    trainNumber: '',
    trainName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    departureDate: '',
    arrivalDate: '',
    totalSeats: '',
    availableSeats: '',
    classPrices: { ...initialClassPrices },
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.classPrices) {
      setFormData({
        ...formData,
        classPrices: {
          ...formData.classPrices,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !formData.trainNumber ||
      !formData.trainName ||
      !formData.source ||
      !formData.destination ||
      !formData.departureTime ||
      !formData.arrivalTime ||
      !formData.departureDate ||
      !formData.arrivalDate ||
      !formData.totalSeats ||
      !formData.availableSeats
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    const payload = {
      ...formData,
      totalSeats: Number(formData.totalSeats),
      availableSeats: Number(formData.availableSeats),
      classPrices: Object.fromEntries(
        Object.entries(formData.classPrices).map(([k, v]) => [k, Number(v)])
      ),
    };

    try {
      const res = await fetch('http://localhost:8086/traininfo/trains/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess('Train added successfully!');
        setFormData({
          trainNumber: '',
          trainName: '',
          source: '',
          destination: '',
          departureTime: '',
          arrivalTime: '',
          departureDate: '',
          arrivalDate: '',
          totalSeats: '',
          availableSeats: '',
          classPrices: { ...initialClassPrices },
        });
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to add train.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  return (
    <div className="train-form-wrapper">
      <button className="train-form-back-button" onClick={() => navigate('/admin/trains')}>
        ← Back
      </button>
      <h2>Add New Train</h2>

      {error && <div className="train-form-error">{error}</div>}
      {success && <div className="train-form-success">{success}</div>}

      <form onSubmit={handleSubmit} className="train-form">
        <div className="train-form-row">
          <label>Train Number *</label>
          <input
            type="text"
            name="trainNumber"
            value={formData.trainNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="train-form-row">
          <label>Train Name *</label>
          <input
            type="text"
            name="trainName"
            value={formData.trainName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="train-form-row">
          <label>Source *</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
          />
        </div>
        <div className="train-form-row">
          <label>Destination *</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>
        <div className="train-form-row">
          <label>Departure Time *</label>
          <input
            type="text"
            name="departureTime"
            placeholder="e.g. 10:00 AM"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="train-form-row">
          <label>Arrival Time *</label>
          <input
            type="text"
            name="arrivalTime"
            placeholder="e.g. 02:00 PM"
            value={formData.arrivalTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="train-form-row">
          <label>Departure Date *</label>
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="train-form-row">
          <label>Arrival Date *</label>
          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="train-form-row">
          <label>Total Seats *</label>
          <input
            type="number"
            min="1"
            name="totalSeats"
            value={formData.totalSeats}
            onChange={handleChange}
            required
          />
        </div>
        <div className="train-form-row">
          <label>Available Seats *</label>
          <input
            type="number"
            min="0"
            name="availableSeats"
            value={formData.availableSeats}
            onChange={handleChange}
            required
          />
        </div>

        <fieldset>
          <legend>Class Prices *</legend>
          {Object.keys(initialClassPrices).map((key) => (
            <div key={key} className="train-form-row">
              <label>{key}</label>
              <input
                type="number"
                min="0"
                name={key}
                value={formData.classPrices[key]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </fieldset>

        <button type="submit" className="train-form-submit">
          Add Train
        </button>
      </form>
    </div>
  );
}
