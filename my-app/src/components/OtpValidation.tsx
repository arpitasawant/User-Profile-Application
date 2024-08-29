import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OtpValidationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const emailFromSignup = queryParams.get('email') || ''; // Retrieve email from query params
  const [email, setEmail] = useState<string>(emailFromSignup); // State to manage email
  const [otp, setOtp] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the email entered matches the one from signup
    if (email !== emailFromSignup) {
      alert('The email entered does not match the one used during signup.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        navigate('/signin'); 
      } else {
        alert(result.error || 'Failed to verify OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      alert('Failed to verify OTP. Please try again.');
    }
  };

  return (
    <div className="otp-validation-container">
      <h2>Verify Your OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OtpValidationPage;
