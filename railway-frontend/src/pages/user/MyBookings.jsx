import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/user/MyBooking.css';
import jsPDF from 'jspdf';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('You must be logged in to view bookings.');
          return;
        }

        const response = await fetch('http://localhost:8086/reservation-service/reservations/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch bookings.');

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBookings();
  }, []);

  const downloadPDF = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Train Ticket', 105, 20, null, null, 'center');

    doc.setFontSize(12);
    let y = 40;

    doc.text(`Reservation ID: ${booking.resId}`, 20, y);
    y += 10;
    doc.text(`PNR: ${booking.pnr || 'Not generated yet'}`, 20, y);
    y += 10;
    doc.text(`Train: ${booking.trainName} (${booking.trainNumber})`, 20, y);
    y += 10;
    doc.text(`From: ${booking.source}    To: ${booking.destination}`, 20, y);
    y += 10;
    doc.text(`Departure: ${new Date(booking.departureDateTime).toLocaleString()}`, 20, y);
    y += 10;
    doc.text(`Arrival: ${new Date(booking.arrivalDateTime).toLocaleString()}`, 20, y);
    y += 10;
    doc.text(`Status: ${booking.status}`, 20, y);
    y += 10;
    doc.text(`Coach Type: ${booking.coachType}`, 20, y);
    y += 10;
    doc.text(`No. of Passengers: ${booking.numberOfPassengers}`, 20, y);
    y += 10;
    doc.text(`Total Fare: ₹${booking.totalFare}`, 20, y);
    y += 10;
    doc.text(`Booking Time: ${new Date(booking.bookingDateTime).toLocaleString()}`, 20, y);
    y += 15;

    doc.text('Passengers:', 20, y);
    y += 10;

    booking.passengers.forEach((p, index) => {
      doc.text(`${index + 1}. ${p.name} (${p.gender}, ${p.age}) – Seat: ${p.seatNumber}`, 25, y);
      y += 8;
    });

    doc.save(`Ticket_${booking.resId}.pdf`);
  };

  return (
    <div className="my-bookings-container">
      <button className="back-button" onClick={() => navigate('/reservations')}>Back</button>
      <h2>My Bookings</h2>
      {error && <p className="error">{error}</p>}
      <div className="booking-cards">
        {bookings.map((booking) => (
          <div key={booking.resId} className="booking-card">
            <h3>{booking.trainName} ({booking.trainNumber})</h3>
            <p><strong>Reservation ID:</strong> {booking.resId}</p>
            <p><strong>PNR:</strong> {booking.pnr || 'Not generated yet'}</p>
            <p><strong>From:</strong> {booking.source} <strong>To:</strong> {booking.destination}</p>
            <p><strong>Departure:</strong> {new Date(booking.departureDateTime).toLocaleString()}</p>
            <p><strong>Arrival:</strong> {new Date(booking.arrivalDateTime).toLocaleString()}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Coach Type:</strong> {booking.coachType}</p>
            <p><strong>No. of Passengers:</strong> {booking.numberOfPassengers}</p>
            <p><strong>Total Fare:</strong> ₹{booking.totalFare}</p>
            <p><strong>Booking Time:</strong> {new Date(booking.bookingDateTime).toLocaleString()}</p>

            <h4>Passengers</h4>
            <ul>
              {booking.passengers.map((p, index) => (
                <li key={index}>{p.name} ({p.gender}, {p.age}) – Seat: {p.seatNumber}</li>
              ))}
            </ul>

            <button
              className="download-button"
              onClick={() => downloadPDF(booking)}
            >
              📥 Download Ticket (PDF)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
