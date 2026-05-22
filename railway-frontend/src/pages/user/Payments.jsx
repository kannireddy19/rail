import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/user/payments.css';

function Payments() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialResId = location.state?.resId || '';
  const initialAmount = location.state?.amount || '';

  const [view, setView] = useState('');
  const [resId, setResId] = useState(initialResId);
  const [amount, setAmount] = useState(initialAmount);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  const token = localStorage.getItem('jwtToken');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const checkIfAlreadyPaid = useCallback(async () => {
    setError('');
    if (!token) {
      setError('You are not authorized. Please log in again.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:8086/payment-service/payments/status/${resId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'SUCCESS') {
          setResult(data);
          setPaymentDone(true);
        } else {
          setPaymentDone(false);
        }
      }
    } catch (err) {
      console.log('No existing payment found');
    }
  }, [resId, token]);

  useEffect(() => {
    if (initialResId && initialAmount) {
      setView('make');
      checkIfAlreadyPaid();
    }
  }, [initialResId, initialAmount, checkIfAlreadyPaid]);

  const handleMakePayment = async () => {
    setError('');

    if (!token) {
      setError('You are not authorized. Please log in again.');
      return;
    }

    if (paymentDone) {
      setError(`✅ Payment already completed for Reservation ID: ${resId}`);
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Failed to load Razorpay SDK');
      return;
    }

    const options = {
      key: 'rzp_test_FjHEReSLNFfFsO', // Replace with your Razorpay test key
      amount: parseFloat(amount) * 100,
      currency: 'INR',
      name: 'Reservation Payment',
      description: 'Booking Payment',
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '6302063232',
      },
      notes: {
        reservation_id: resId,
      },
      handler: async function (response) {
        try {
          const res = await fetch('http://localhost:8086/payment-service/payments/process', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              resId,
              amount: parseFloat(amount),
              paymentMethod: 'RAZOR_PAY',
              razorpayPaymentId: response.razorpay_payment_id,
            }),
          });

          if (!res.ok) throw new Error('Payment failed');
          const data = await res.json();
          setResult(data);
          setPaymentDone(true);
        } catch (err) {
          setError(err.message || 'Something went wrong while processing the payment.');
        }
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCheckStatus = async () => {
    setResult(null);
    setError('');

    if (!token) {
      setError('You are not authorized. Please log in again.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8086/payment-service/payments/status/${resId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Payment not found for Reservation ID: ${resId}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve payment status.');
    }
  };

  return (
    <div className="payments-wrapper">
      <button className="back-button" onClick={() => navigate('/user-dashboard')}>
        ⬅ Back
      </button>

      <h2 className="payments-title">Payments</h2>

      <div className="payment-card-container">
        <div className="payment-card" onClick={() => setView('make')}>
          💳 Make Payment
        </div>
        <div className="payment-card" onClick={() => setView('status')}>
          📄 Payment Status
        </div>
      </div>

      {view === 'make' && (
        <>
          <div className="payment-form">
            <h3>Make a Payment</h3>
            <input
              type="text"
              placeholder="Reservation ID"
              value={resId}
              onChange={(e) => setResId(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p><strong>Payment Method:</strong> RAZOR_PAY</p>
            <button
              onClick={handleMakePayment}
              style={{
                backgroundColor: '#3399cc',
                cursor: 'pointer',
              }}
            >
              Pay Now
            </button>
          </div>
          {/* Dummy content to test scroll */}
          <div style={{ height: '1500px' }}></div>
        </>
      )}

      {view === 'status' && (
        <div className="payment-form">
          <h3>Check Payment Status</h3>
          <input
            type="text"
            placeholder="Reservation ID"
            value={resId}
            onChange={(e) => setResId(e.target.value)}
          />
          <button onClick={handleCheckStatus}>Check Status</button>
        </div>
      )}

      {error && <p className="payment-error">{error}</p>}

      {result && (
        <div className="payment-result">
          <h4>Payment Details</h4>
          <p><strong>Payment ID:</strong> {result.paymentId}</p>
          <p><strong>Reservation ID:</strong> {result.resId}</p>
          <p><strong>PNR:</strong> {result.pnr}</p>
          <p><strong>Amount:</strong> ₹{result.amount}</p>
          <p><strong>Method:</strong> {result.paymentMethod}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Time:</strong> {new Date(result.paymentTime).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export default Payments;
