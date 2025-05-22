import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Common components
import Header from './components/molecule/Header';
import PrivateRoute from './components/Route/PrivateRoute';

// Auth components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// Software components
import CreateSoftware from './components/software/CreateSoftware';
import SoftwareList from './components/software/SoftwareList';

// Request components
import CreateRequest from './components/requests/CreateRequest';
import PendingRequests from './components/requests/PendingRequests';
import MyRequests from './components/requests/MyRequests';
// CSS
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<PrivateRoute />}>
                {/* Default redirect based on role */}
                <Route 
                  path="/" 
                  element={
                    <RoleBasedRedirect 
                      adminPath="/create-software"
                      managerPath="/pending-requests"
                      employeePath="/request-access"
                    />
                  } 
                />
                
                {/* Software routes */}
                <Route path="/software" element={<SoftwareList />} />
                
                {/* Admin routes */}
                <Route 
                  element={<PrivateRoute allowedRoles={['Admin']} />}
                >
                  <Route path="/create-software" element={<CreateSoftware />} />
                </Route>
                
                {/* Manager routes */}
                <Route 
                  element={<PrivateRoute allowedRoles={['Manager']} />}
                >
                  <Route path="/pending-requests" element={<PendingRequests />} />
                </Route>
                
                {/* Employee routes */}
                <Route 
                  element={<PrivateRoute allowedRoles={['Employee']} />}
                >
                  <Route path="/request-access" element={<CreateRequest />} />
                  <Route path="/my-requests" element={<MyRequests />} />
                </Route>
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} User Access Management System</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Helper component to redirect users based on their role
const RoleBasedRedirect = ({ adminPath, managerPath, employeePath }) => {
  const { currentUser } = useAuth();
  
  if (currentUser?.role === 'Admin') {
    return <Navigate to={adminPath} replace />;
  } else if (currentUser?.role === 'Manager') {
    return <Navigate to={managerPath} replace />;
  } else {
    return <Navigate to={employeePath} replace />;
  }
};

export default App;