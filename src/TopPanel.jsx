import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TopPanel = () => {
  const [userData, setUserData] = useState({ email: null, credits: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://encounterra.com/api/user_data');
        if (!response.ok) {
          console.error('Server response was not OK', response.status);
          throw new Error('Server response was not OK');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleLogout = async () => {
    try {
      await fetch('https://encounterra.com/api/logout', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
  
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUserData({ email: null, credits: null });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  const handleLogin = () => {
    navigate('/login');
  };

  const isLoggedIn = userData.email !== null;

  return (
    <div className="top-panel">
      <a href="https://www.buymeacoffee.com/encounterra" target="_blank">
        <img className="coffee-button" src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" />
      </a>
      <div className="login-container">
        {isLoggedIn ? (
          <>
            <span>{userData.email}</span>
            <span>Credits: {userData.credits === '-1' ? '∞' : userData.credits}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>
    </div>
  );
};

export default TopPanel;
