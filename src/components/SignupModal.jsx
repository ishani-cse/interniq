import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { registerUser } from './auth';
import './styles/Modal.css';

export default function SignupModal({ onClose, onToggle }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Password strength calculator
  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    const feedback = {
      hasMinLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumbers: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };

    Object.values(feedback).forEach((criterion) => {
      if (criterion) strength += 20;
    });

    return { strength, feedback };
  };

  const { strength, feedback } = calculatePasswordStrength(password);

  const getStrengthLabel = () => {
    if (strength < 20) return { label: 'Very Weak', color: '#ef4444' };
    if (strength < 40) return { label: 'Weak', color: '#f97316' };
    if (strength < 60) return { label: 'Fair', color: '#eab308' };
    if (strength < 80) return { label: 'Good', color: '#84cc16' };
    return { label: 'Strong', color: '#22c55e' };
  };

  const strengthInfo = getStrengthLabel();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (strength < 80) {
      setError('Password must be Strong.');
      return;
    }

    const result = registerUser({ name: fullName, email, password });

    if (!result.ok) {
      setError(result.error); // "This email is already registered..."
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
          <h2>Create Account</h2>
          <p>Join InternIQ to find your dream internship</p>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password with Strength Indicator */}
          <div className="form-group">
            <label>Password</label>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '40px', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#6b7280')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Strength Bar */}
            {password && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    flex: 1,
                    height: '6px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${strength}%`,
                      backgroundColor: strengthInfo.color,
                      borderRadius: '3px',
                      transition: 'width 0.3s ease, background-color 0.3s ease',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: strengthInfo.color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {strengthInfo.label}
                </span>
              </div>
            )}

            {/* Requirements Checklist */}
            {password && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {[
                  { met: feedback.hasMinLength, text: 'At least 8 characters' },
                  { met: feedback.hasUpperCase, text: 'One uppercase letter (A-Z)' },
                  { met: feedback.hasLowerCase, text: 'One lowercase letter (a-z)' },
                  { met: feedback.hasNumbers, text: 'One number (0-9)' },
                  { met: feedback.hasSpecialChar, text: 'One special character (!@#$%^&*)' },
                ].map((req, idx) => (
                  <div
                    key={idx}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}
                  >
                    {req.met ? (
                      <Check size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
                    ) : (
                      <X size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                    )}
                    <span
                      style={{
                        color: req.met ? '#22c55e' : '#9ca3af',
                        fontWeight: req.met ? '500' : '400',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px' }}>{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-submit"
            disabled={strength < 80}
            style={{
              opacity: strength < 80 ? 0.5 : 1,
              cursor: strength < 80 ? 'not-allowed' : 'pointer',
            }}
          >
            {strength < 80 ? 'Create Strong Password' : 'Sign Up'}
          </button>
        </form>

        <div className="modal-divider">
          <span>Already have an account?</span>
        </div>

        <button className="btn-toggle" onClick={onToggle}>
          Log In Instead
        </button>
      </div>
    </div>
  );
}