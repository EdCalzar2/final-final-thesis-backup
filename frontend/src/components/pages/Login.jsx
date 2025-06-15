import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import finalLogo from '../../assets/final_logo.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill out both username and password.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Login failed.');
        return;
      }

      const data = await response.json();

      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userName', username);

      if (data.role === 'admin') {
        navigate('/manageStories');
      } else {
        navigate('/story');
      }

    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="left-section">
        <h1>
          Her Voice.<br />
          Her Safety.
        </h1>
        <p>
          Share your <b>experiences</b>, report <b>unsafe areas</b>, support each other — no one should <b>feel alone</b> in their <b>safety journey</b>.
        </p>
      </div>
      <div className="right-section">
        <div className="login-box">
          <img src={finalLogo} alt="Logo" />
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ color: 'red', marginBottom: '12px', fontWeight: 'bold' }}>
                {error}
              </div>
            )}
            <label><b>Username</b></label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <label><b>Password</b></label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit">Log in</button>
          </form>
          <p className='account'>
            <a href="#" onClick={e => { e.preventDefault(); navigate('/signUp'); }}>Don't have an account?</a>
            <p className='account'>
  <a href="#" onClick={e => { e.preventDefault(); navigate('/forgot-password'); }}>Forgot your password?</a>
</p>
          </p>
        </div>
      </div>
    </div>
  );
}
