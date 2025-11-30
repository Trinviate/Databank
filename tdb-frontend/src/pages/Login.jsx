import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/Login.css';
import logo from '../assets/TDB logo.png';
import bgImage from '../assets/uphsl.png'; // import the image

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const isFormComplete = email.length > 0 && password.length > 0;

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');
    if (isFormComplete) {
      console.log('Logging in with:', { email, password });
      setMessage('Login attempt successful! (See console for details)');
    }
  };

  return (
    <div className="login-container">
      <div
        className="login-bg"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      ></div>
      <div className="login-overlay"></div>

      <form onSubmit={handleLogin} className="login-box">
        <div className="login-content">
          <img
            src={logo}
            alt="TDB Logo"
            className="login-logo"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/1C4DA1/FFFFFF?text=TDB' }}
          />
          <div className="login-line" />

          <h1 className="login-title">Login</h1>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="username@uphsl.edu.ph"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <a href="#" className="forgot-password">Forgot Password?</a>

          {message && <div className="login-message">{message}</div>}

          <button type="submit" disabled={!isFormComplete} className="login-button">
            Login
          </button>

          <p className="contact-us">
            Don't have an account?
            <a href="#">Contact Us</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
