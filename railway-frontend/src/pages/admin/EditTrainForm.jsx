import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/admin/EditTrainForm.css';

function EditTrainForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trainData, setTrainData] = useState({
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
    runningDays: '',
    classPrices: {
      FIRST_AC: '',
      SECOND_AC: '',
      THIRD_AC: '',
      SLEEPER: '',
      GENERAL: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTrainData = async () => {
      try {
        const response = await fetch(`http://localhost:8086/traininfo/trains/get/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });

        if (!response.ok) throw new Error(`Error fetching train: ${response.status}`);

        const data = await response.json();

        setTrainData((prev) => ({
          ...prev,
          ...data,
          classPrices: {
            ...prev.classPrices,
            ...(data.classPrices || {}),
          },
        }));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('❌ Failed to fetch train data.');
        setLoading(false);
      }
    };

    fetchTrainData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('classPrices.')) {
      const classKey = name.split('.')[1];
      setTrainData((prev) => ({
        ...prev,
        classPrices: {
          ...prev.classPrices,
          [classKey]: parseFloat(value) || '',
        },
      }));
    } else {
      setTrainData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`http://localhost:8086/traininfo/trains/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify(trainData),
      });

      if (!res.ok) throw new Error('Update failed');

      setSuccess('✅ Train updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        setSuccess('');
        navigate('/admin/train/list');
      }, 4000);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to update train');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-train-form-container">
      <button className="back-button" onClick={() => navigate('/admin/train/list')}>
        ← Back to Train List
      </button>

      <h2>Edit Train</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="train-form">
        <label>Train Number
          <input type="text" name="trainNumber" value={trainData.trainNumber} onChange={handleChange} required />
        </label>
        <label>Train Name
          <input type="text" name="trainName" value={trainData.trainName} onChange={handleChange} required />
        </label>
        <label>Source
          <input type="text" name="source" value={trainData.source} onChange={handleChange} required />
        </label>
        <label>Destination
          <input type="text" name="destination" value={trainData.destination} onChange={handleChange} required />
        </label>
        <label>Departure Time
          <input type="text" name="departureTime" value={trainData.departureTime} onChange={handleChange} required />
        </label>
        <label>Arrival Time
          <input type="text" name="arrivalTime" value={trainData.arrivalTime} onChange={handleChange} required />
        </label>
        <label>Departure Date
          <input type="date" name="departureDate" value={trainData.departureDate} onChange={handleChange} required />
        </label>
        <label>Arrival Date
          <input type="date" name="arrivalDate" value={trainData.arrivalDate} onChange={handleChange} required />
        </label>
        <label>Total Seats
          <input type="number" name="totalSeats" value={trainData.totalSeats} onChange={handleChange} required />
        </label>
        <label>Available Seats
          <input type="number" name="availableSeats" value={trainData.availableSeats} onChange={handleChange} required />
        </label>
        <label>Running Days
          <input type="text" name="runningDays" value={trainData.runningDays} onChange={handleChange} required />
        </label>

        <fieldset>
          <legend>Class Prices</legend>
          <label>First AC
            <input type="number" name="classPrices.FIRST_AC" value={trainData.classPrices.FIRST_AC || ''} onChange={handleChange} required />
          </label>
          <label>Second AC
            <input type="number" name="classPrices.SECOND_AC" value={trainData.classPrices.SECOND_AC || ''} onChange={handleChange} required />
          </label>
          <label>Third AC
            <input type="number" name="classPrices.THIRD_AC" value={trainData.classPrices.THIRD_AC || ''} onChange={handleChange} required />
          </label>
          <label>Sleeper
            <input type="number" name="classPrices.SLEEPER" value={trainData.classPrices.SLEEPER || ''} onChange={handleChange} required />
          </label>
          <label>General
            <input type="number" name="classPrices.GENERAL" value={trainData.classPrices.GENERAL || ''} onChange={handleChange} required />
          </label>
        </fieldset>

        <button type="submit" className="submit-button">Update Train</button>
      </form>
    </div>
  );
}

export default EditTrainForm;
