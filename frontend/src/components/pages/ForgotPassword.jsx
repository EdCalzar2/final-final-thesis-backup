import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forgotPassword.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleBackButton = () => {
      navigate('/');
  }

  // Step 1: Verify email exists
  const handleEmailCheck = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:3001/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const text = await res.text();
        setMessage(text);
        return;
      }

      // Show password reset modal on success
      setShowResetModal(true);
    } catch {
      setMessage('An error occurred. Please try again.');
    }
  };

  // Step 2: Reset password (inside modal)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!res.ok) {
        const text = await res.text();
        setMessage(text);
        return;
      }

      setMessage('✅ Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 1500);
    } catch {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className='forgotPass-background'>
    <div className="forgot-password">
      <h4 className='backButton' onClick={handleBackButton}>{'<'}</h4>
      <h2>Forgot Password</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}

      {!showResetModal && (
        <form className='email-form' onSubmit={handleEmailCheck}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder='yourvoice@gmail.com'
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button className='verify-btn' type="submit">Verify Email</button>
        </form>
      )}

      {/* Modal popup for new password */}
      {showResetModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Reset Your Password</h3>
            <form onSubmit={handleResetPassword}>
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className='changePassword-btn'>Change Password</button>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className='cancel-btn'
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add simple modal styles or use your CSS */}
      <style>{`
        .modal {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 300px;
        }
        label {
          display: block;
          margin-top: 10px;
        }
        input {
          width: 100%;
          padding: 6px;
          margin-top: 4px;
          box-sizing: border-box;
        }
        button {
          margin-top: 12px;
          padding: 8px 16px;
        }
      `}</style>
    </div>
    </div>
  );
}
