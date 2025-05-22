import React, { useState, useEffect } from 'react';
import requestService from '../../services/requestService';
import { useAuth } from '../../contexts/AuthContext';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch user's requests on component mount
    const fetchUserRequests = async () => {
      try {
        const data = await requestService.getUserRequests();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load your requests');
        setLoading(false);
      }
    };

    fetchUserRequests();
  }, []);

  if (loading) {
    return <div className="loading">Loading your requests...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (requests.length === 0) {
    return <div className="no-data">You haven't made any access requests yet.</div>;
  }

  // Helper function to get badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'status-badge approved';
      case 'Rejected':
        return 'status-badge rejected';
      default:
        return 'status-badge pending';
    }
  };

  return (
    <div className="my-requests-container">
      <h2>My Access Requests</h2>
      
      <div className="request-list">
        {requests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <h3>Request #{request.id}</h3>
              <span className={getStatusBadgeClass(request.status)}>
                {request.status}
              </span>
            </div>
            
            <div className="request-details">
              <p><strong>Software:</strong> {request.software.name}</p>
              <p><strong>Access Type:</strong> {request.accessType}</p>
              <p><strong>Reason:</strong> {request.reason}</p>
              <p><strong>Requested:</strong> {new Date(request.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;