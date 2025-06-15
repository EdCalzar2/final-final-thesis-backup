import React, { useState } from 'react';
import './Signup.css';
import { NavLink } from 'react-router-dom';
export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });

  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.dateOfBirth) {
      setMessageColor('red');
      setMessage('Please fill all fields.');
      return;
    }

    if (formData.password.length < 8) {
      setMessageColor('red');
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessageColor('red');
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const { name, email, password, dateOfBirth } = formData;
      const res = await fetch('http://localhost:3001/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, dateOfBirth }),
      });

      if (res.ok) {
        const text = await res.text();
        setMessageColor('green');
        setMessage(text);
        setFormData({ name: '', email: '', password: '', confirmPassword: '', dateOfBirth: '' });
      } else {
        const errorText = await res.text();
        setMessageColor('red');
        setMessage(`Failed: ${errorText}`);
      }
    } catch (error) {
      setMessageColor('red');
      setMessage('Error submitting form.');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <p className='createAccount'>Create an account</p>
     
        <input type="text" name="name" placeholder="Username" value={formData.name} onChange={handleChange} required />
        
        <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        <input type="date" name="dateOfBirth" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} required />

        <button type="submit">Submit</button>

        <p className='accountExist'>
          Already have an account?{' '}
          <NavLink to="/" className='login'>
            Login
          </NavLink>
        </p>

        {message && (
          <p className="message" style={{ color: messageColor }}>{message}</p>
        )}
      </form>
    </div>
  );
}
