import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Component for protecting routes that require authentication
const PrivateRoute = ({ allowedRoles = [] }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  // Show loading state while auth state is being determined
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified and user doesn't have required role, redirect to home
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and has proper role, render the child routes
  return <Outlet />;
};

export default PrivateRoute;