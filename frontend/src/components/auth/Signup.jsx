import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff, FiUserPlus, FiCheck, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import './Signup.scss';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Employee',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthLabel = () => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[passwordStrength] || 'Very Weak';
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];
    return colors[passwordStrength] || '#ef4444';
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateForm = () => {
    const { username, password, confirmPassword } = formData;
    
    if (!username.trim()) {
      toast.error('Username is required');
      return false;
    }
    
    if (username.length < 3) {
      toast.error('Username must be at least 3 characters long');
      return false;
    }
    
    if (!password) {
      toast.error('Password is required');
      return false;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const { username, password, role } = formData;
      
      await authService.register({
        username: username.trim(),
        password,
        role,
      });
      
      toast.success('Account created successfully! Please sign in.');
      
      // Redirect to login after short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'Employee', label: 'Employee', description: 'Request software access' },
    { value: 'Manager', label: 'Manager', description: 'Approve/reject requests' },
    { value: 'Admin', label: 'Admin', description: 'Manage software and users' },
  ];

  return (
    <div className="signup">
      <div className="signup__container">
        <div className="signup__header">
          <div className="signup__logo">
            <FiUserPlus className="signup__logo-icon" />
          </div>
          <h1 className="signup__title">Create Account</h1>
          <p className="signup__subtitle">Join us and get started today</p>
        </div>

        <form className="signup__form" onSubmit={handleSubmit}>
          <div className="signup__form-group">
            <label className="signup__label" htmlFor="username">
              Username
            </label>
            <div className="signup__input-wrapper">
              <FiUser className="signup__input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                className="signup__input"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
              {formData.username.length >= 3 && (
                <div className="signup__input-success">
                  <FiCheck />
                </div>
              )}
            </div>
          </div>

          <div className="signup__form-group">
            <label className="signup__label" htmlFor="password">
              Password
            </label>
            <div className="signup__input-wrapper">
              <FiLock className="signup__input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="signup__input"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="signup__password-toggle"
                onClick={() => togglePasswordVisibility('password')}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {formData.password && (
              <div className="signup__password-strength">
                <div className="signup__password-strength-bar">
                  <div
                    className="signup__password-strength-fill"
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(),
                    }}
                  ></div>
                </div>
                <span
                  className="signup__password-strength-label"
                  style={{ color: getPasswordStrengthColor() }}
                >
                  {getPasswordStrengthLabel()}
                </span>
              </div>
            )}
          </div>

          <div className="signup__form-group">
            <label className="signup__label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="signup__input-wrapper">
              <FiLock className="signup__input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className="signup__input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="signup__password-toggle"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {formData.password && formData.confirmPassword && (
                <div className="signup__input-validation">
                  {formData.password === formData.confirmPassword ? (
                    <FiCheck className="signup__input-validation--success" />
                  ) : (
                    <span className="signup__input-validation--error">✕</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="signup__form-group">
            <label className="signup__label" htmlFor="role">
              Role
            </label>
            <div className="signup__input-wrapper">
              <FiShield className="signup__input-icon" />
              <select
                id="role"
                name="role"
                className="signup__select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="signup__role-description">
              {roleOptions.find(option => option.value === formData.role)?.description}
            </div>
          </div>

          <button
            type="submit"
            className={`signup__submit-btn ${loading ? 'signup__submit-btn--loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="signup__spinner"></div>
                Creating account...
              </>
            ) : (
              <>
                <FiUserPlus />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="signup__footer">
          <p className="signup__footer-text">
            Already have an account?{' '}
            <Link to="/login" className="signup__footer-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;