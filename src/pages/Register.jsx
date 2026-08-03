import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../App.css';

function Register({ onRegister }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await onRegister({ username, password });

    if (result.success) {
      alert('Registered successfully.');
      navigate('/');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="auth-shell auth-animation">
      <div className="auth-card">
        <p className="eyebrow">Start fresh</p>
        <h1 className="auth-title">Register</h1>
        <p className="auth-subtitle">Create your account to organize tasks with ease.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button type="submit" className="primary-btn">
            Create account
          </button>
        </form>

        <div className="auth-divider" />
        <p
          onClick={() => {
            navigate('/');
          }}
          className="secondary-link"
        >
          Already have an account?
        </p>
      </div>
    </div>
  );
}

export default Register;
