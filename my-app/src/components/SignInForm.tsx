import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignInForm.css';
import Image from "../assets/Signin.jpg"; 
const SignInForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        navigate('/user-profile'); 
      } else {
        alert(result.error || 'Failed to log in. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Failed to log in. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src={Image} alt="Writo Education" className="left-image" />
      </div>
      <div className="right-section">
        <h2 className="sign-in-title">Fill what we know <span className='mark'>!</span></h2>
        <form className="sign-in-form" onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="sign-in-btn">Sign In</button>
          <Link to="/reset-password" className="reset-password-link">Reset Password?</Link>
          <Link to="/signup" className="sign-up-btn">Sign Up</Link>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
