import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiLogIn, 
  FiLoader,
  FiShield,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import './Login.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { username, password } = formData;
      
      if (!username || !password) {
        toast.error('Username and password are required');
        return;
      }

      const result = await authService.login(formData);
      
      // Store auth data
      login(result.user, result.token);
      
      toast.success(`Welcome back, ${result.user.username}!`);
      
      // Redirect based on role
      if (result.user.role === 'Admin') {
        navigate('/create-software');
      } else if (result.user.role === 'Manager') {
        navigate('/pending-requests');
      } else {
        navigate('/request-access');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.username.trim() && formData.password.trim();

  return (
    <div className="login">
      <div className="login__background">
        <div className="login__background-shape login__background-shape--1"></div>
        <div className="login__background-shape login__background-shape--2"></div>
        <div className="login__background-shape login__background-shape--3"></div>
      </div>

      <div className="login__container">
        <div className="login__card">
          <div className="login__header">
            <div className="login__logo">
              <FiShield className="login__logo-icon" />
              <div className="login__logo-pulse"></div>
            </div>
            <h1 className="login__title">Welcome Back</h1>
            <p className="login__subtitle">
              Sign in to access your secure dashboard
            </p>
          </div>

          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <div className={`login__form-group ${focusedField === 'username' ? 'login__form-group--focused' : ''} ${formData.username ? 'login__form-group--filled' : ''}`}>
              <label className="login__label" htmlFor="username">
                Username
              </label>
              <div className="login__input-wrapper">
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="login__input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => handleFocus('username')}
                  onBlur={handleBlur}
                  required
                  autoComplete="username"
                />
                {formData.username && (
                  <FiCheck className="login__input-check" />
                )}
              </div>
            </div>

            <div className={`login__form-group ${focusedField === 'password' ? 'login__form-group--focused' : ''} ${formData.password ? 'login__form-group--filled' : ''}`}>
              <label className="login__label" htmlFor="password">
                Password
              </label>
              <div className="login__input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="login__input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login__password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                {formData.password && (
                  <FiCheck className="login__input-check login__input-check--password" />
                )}
              </div>
            </div>

            <div className="login__form-options">
              <label className="login__checkbox">
                <input type="checkbox" />
                <span className="login__checkbox-custom"></span>
                <span className="login__checkbox-text">Remember me</span>
              </label>
              <Link to="/forgot-password" className="login__forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`login__submit-btn ${loading ? 'login__submit-btn--loading' : ''} ${!isFormValid ? 'login__submit-btn--disabled' : ''}`}
              disabled={loading || !isFormValid}
            >
              <span className="login__submit-content">
                {loading ? (
                  <>
                    <FiLoader className="login__submit-icon login__submit-icon--spinning" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <FiLogIn className="login__submit-icon" />
                    Sign In
                    <FiArrowRight className="login__submit-arrow" />
                  </>
                )}
              </span>
              <div className="login__submit-bg"></div>
            </button>
          </form>


          <div className="login__footer">
            <p className="login__footer-text">
              Don't have an account?{' '}
              <Link to="/signup" className="login__footer-link">
                Create one
                <FiArrowRight className="login__footer-arrow" />
              </Link>
            </p>
          </div>
        </div>

        <div className="login__info">
          <div className="login__info-content">
            <h2>Secure Access Management</h2>
            <p>
              Streamline your software access requests with our professional 
              management system. Built with security and efficiency in mind.
            </p>
            <div className="login__features">
              <div className="login__feature">
                <FiShield className="login__feature-icon" />
                <span>Enterprise Security</span>
              </div>
              <div className="login__feature">
                <FiCheck className="login__feature-icon" />
                <span>Instant Approvals</span>
              </div>
              <div className="login__feature">
                <FiUser className="login__feature-icon" />
                <span>Role-based Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;