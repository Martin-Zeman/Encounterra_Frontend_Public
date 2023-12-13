import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const verificationCode = queryParams.get('code'); // VERIFICATION CODE from the URL
  const navigate = useNavigate(); // Hook to navigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://encounterra.com/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode, newPassword }),
      });
      if (!response.ok) {
        throw new Error('Password reset failed');
      }
      // Using window.alert for simplicity, but consider a modal or custom dialog for production
      alert('Password has been reset successfully.');
      navigate('/'); // Navigate to the root after the alert is closed
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="verification_code">Verification Code:</label>
          <input
            type="text"
            className="form-control"
            id="verification_code"
            value={verificationCode}
            readOnly // Set this field to readOnly if the user shouldn't change it
          />
        </div>
        <div className="form-group">
          <label htmlFor="new_password">New Password:</label>
          <input
            type="password"
            className="form-control"
            id="new_password"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
