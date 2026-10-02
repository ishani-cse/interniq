import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './auth';
import './styles/Modal.css';

export default function LoginModal({ onClose, onToggle }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = loginUser(email, password);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your InternIQ account</p>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-remember">
            <label className="checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#forgot">Forgot password?</a>
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px' }}>{error}</p>
          )}

          <button type="submit" className="btn-submit">Sign In</button>
        </form>

        <div className="modal-divider">
          <span>Don't have an account?</span>
        </div>

        <button className="btn-toggle" onClick={onToggle}>Create New Account</button>
      </div>
    </div>
  );
}