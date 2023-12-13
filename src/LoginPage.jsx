import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://encounterra.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const { status, data } = await response.json();
  
      if (status === 'success') {
        localStorage.setItem('accessToken', data.AccessToken);
        localStorage.setItem('refreshToken', data.RefreshToken);
        navigate('/');
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <div className="container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Log In</button>
      </form>
      <div className="register-link">
        Don't have an account? <Link to="/register">Sign up</Link>
      </div>
      <div className="forgot-password-link">
        Forgot your password? <Link to="/forgot_password">Reset it</Link>
      </div>
    </div>
  );
};

export default LoginPage;
