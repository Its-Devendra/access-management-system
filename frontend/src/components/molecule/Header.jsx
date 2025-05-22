import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiShield, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiSettings,
  FiFileText,
  FiUserCheck,
  FiPlus,
  FiList,
  FiUserPlus
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import './Header.scss';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getNavigationItems = () => {
    if (!isAuthenticated) return [];

    const items = [];

    // Role-specific navigation
    if (currentUser.role === 'Admin') {
      items.push({
        to: '/create-software',
        label: 'Create Software',
        icon: FiPlus,
        description: 'Add new software applications'
      });
    }

    if (currentUser.role === 'Manager') {
      items.push({
        to: '/pending-requests',
        label: 'Pending Requests',
        icon: FiUserCheck,
        description: 'Review access requests'
      });
    }

    if (currentUser.role === 'Employee') {
      items.push(
        {
          to: '/request-access',
          label: 'Request Access',
          icon: FiUserPlus,
          description: 'Request software access'
        },
        {
          to: '/my-requests',
          label: 'My Requests',
          icon: FiFileText,
          description: 'View your requests'
        }
      );
    }

    // Common navigation
    items.push({
      to: '/software',
      label: 'Software List',
      icon: FiList,
      description: 'Browse available software'
    });

    return items;
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'header__role-badge header__role-badge--admin';
      case 'Manager':
        return 'header__role-badge header__role-badge--manager';
      default:
        return 'header__role-badge header__role-badge--employee';
    }
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <div className="header__brand">
          <Link to="/" className="header__logo">
            <FiShield className="header__logo-icon" />
            <span className="header__logo-text">
              <span className="header__logo-primary">Access</span>
              <span className="header__logo-secondary">Control</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {isAuthenticated && (
          <nav className="header__nav header__nav--desktop">
            {getNavigationItems().map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="header__nav-link"
                title={item.description}
              >
                <item.icon className="header__nav-icon" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* User Actions */}
        <div className="header__actions">
          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <div className="header__user-menu">
                <button
                  className="header__user-trigger"
                  onClick={toggleUserMenu}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="header__user-avatar">
                    <FiUser />
                  </div>
                  <div className="header__user-info">
                    <span className="header__username">{currentUser.username}</span>
                    <span className={getRoleBadgeClass(currentUser.role)}>
                      {currentUser.role}
                    </span>
                  </div>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="header__user-dropdown">
                    <div className="header__user-dropdown-header">
                      <div className="header__user-avatar header__user-avatar--large">
                        <FiUser />
                      </div>
                      <div>
                        <div className="header__user-dropdown-name">
                          {currentUser.username}
                        </div>
                        <div className={getRoleBadgeClass(currentUser.role)}>
                          {currentUser.role}
                        </div>
                      </div>
                    </div>
                    
                    <div className="header__user-dropdown-divider"></div>
                    
                    <button
                      className="header__user-dropdown-item"
                      onClick={handleLogout}
                    >
                      <FiLogOut />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="header__mobile-toggle"
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            </>
          ) : (
            <div className="header__auth-links">
              <Link to="/login" className="header__auth-link">
                Sign In
              </Link>
              <Link to="/signup" className="header__auth-link header__auth-link--primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="header__mobile-nav">
          <div className="header__mobile-nav-content">
            {getNavigationItems().map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="header__mobile-nav-link"
                onClick={closeMobileMenu}
              >
                <item.icon className="header__mobile-nav-icon" />
                <div>
                  <div className="header__mobile-nav-label">{item.label}</div>
                  <div className="header__mobile-nav-desc">{item.description}</div>
                </div>
              </Link>
            ))}
            
            <div className="header__mobile-nav-divider"></div>
            
            <button
              className="header__mobile-nav-link header__mobile-nav-link--logout"
              onClick={handleLogout}
            >
              <FiLogOut className="header__mobile-nav-icon" />
              <div>
                <div className="header__mobile-nav-label">Sign Out</div>
                <div className="header__mobile-nav-desc">Exit your account</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="header__backdrop"
          onClick={closeMobileMenu}
        ></div>
      )}
    </header>
  );
};

export default Header;