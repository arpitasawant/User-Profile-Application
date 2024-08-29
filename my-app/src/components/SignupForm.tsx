import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignUpForm.css';
import Image from '../assets/SignUp.jpg';

const SignupForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [contactMode, setContactMode] = useState<string>('');
  const [contactValue, setContactValue] = useState<string>('');
  const [email, setEmail] = useState<string>(''); // Email state
  const navigate = useNavigate();

  const handleContactModeChange = (mode: string) => {
    setContactMode(mode);
    setContactValue('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contactModeData = contactMode === 'Email' ? { email: contactValue } : { mobile: contactValue };

    const formData = {
      firstName,
      lastName,
      password,
      confirmPassword,
      email, 
      contactMode: contactModeData,
    };

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        if (!result.isVerified) {
          navigate(`/otp-validation?email=${encodeURIComponent(email)}`);
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(result.error || 'Failed to sign up. Please try again.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      alert('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src={Image} alt="Writo Education" className="left-image" />
      </div>
      <div className="right-section">
        <div className="header-section">
          <h2 className="sign-up-title">Let us know <span className="mark">!</span></h2>
          <Link to="/signin" className="signin-link">Sign <span className="mark">In</span></Link>
        </div>
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <input
            type="text"
            id="first_name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            id="last_name"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="password"
            id="set_password"
            placeholder="Set Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            id="retype_password"
            placeholder="Retype Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="combined-input">
            <input
              type={contactMode === 'Email' ? 'email' : 'tel'}
              id="contact_input"
              placeholder={contactMode ? `Enter ${contactMode}` : 'Contact Mode'}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              disabled={!contactMode}
            />
            <select
              className="contact-mode-select"
              value={contactMode}
              onChange={(e) => handleContactModeChange(e.target.value)}
            >
              <option value="" disabled>Select Mode</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
            </select>
          </div>

          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="sign-up-btn" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
