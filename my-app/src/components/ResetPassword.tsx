import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || 'Password reset successfully.');
        navigate('/signin'); // Redirect to the login page after successful password reset
      } else {
        alert(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password Reset Error:', error);
      alert('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Password</h2>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="currentPassword"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          id="newPassword"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit" className="reset-password-btn">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
