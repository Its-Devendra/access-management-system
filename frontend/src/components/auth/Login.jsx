import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
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
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__header">
          <div className="login__logo">
            <FiLogIn className="login__logo-icon" />
          </div>
          <h1 className="login__title">Welcome Back</h1>
          <p className="login__subtitle">Sign in to your account</p>
        </div>

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__form-group">
            <label className="login__label" htmlFor="username">
              Username
            </label>
            <div className="login__input-wrapper">
              <FiUser className="login__input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                className="login__input"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="login__form-group">
            <label className="login__label" htmlFor="password">
              Password
            </label>
            <div className="login__input-wrapper">
              <FiLock className="login__input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="login__input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
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
            </div>
          </div>

          <button
            type="submit"
            className={`login__submit-btn ${loading ? 'login__submit-btn--loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="login__spinner"></div>
                Signing in...
              </>
            ) : (
              <>
                <FiLogIn />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login__footer">
          <p className="login__footer-text">
            Don't have an account?{' '}
            <Link to="/signup" className="login__footer-link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;