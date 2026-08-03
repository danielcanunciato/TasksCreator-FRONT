import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../App.css';

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await onLogin({ username, password });

    if (result.success) {
      alert('Logged in successfully.');
      navigate('/tasks');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="auth-shell auth-animation">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Access your tasks and stay on top of your day.</p>

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
            Enter
          </button>
        </form>

        <div className="auth-divider" />
        <p
          onClick={() => {
            navigate('/register');
          }}
          className="secondary-link"
        >
          Create an account
        </p>
      </div>
    </div>
  );
}

export default Login;
