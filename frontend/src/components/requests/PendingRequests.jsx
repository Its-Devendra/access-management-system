import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import requestService from '../../services/requestService';
import { useAuth } from '../../contexts/AuthContext';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Redirect if not manager
  if (currentUser?.role !== 'Manager') {
    navigate('/');
    return null;
  }

  useEffect(() => {
    // Fetch pending requests on component mount
    const fetchPendingRequests = async () => {
      try {
        const data = await requestService.getPendingRequests();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load pending requests');
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleUpdateStatus = async (requestId, status) => {
    setProcessing(true);
    try {
      await requestService.updateRequestStatus(requestId, status);
      
      // Update the requests list after approving/rejecting
      setRequests(requests.filter(request => request.id !== requestId));
    } catch (err) {
      setError(err.message || `Failed to ${status.toLowerCase()} request`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (requests.length === 0) {
    return <div className="no-data">No pending requests available.</div>;
  }

  return (
    <div className="pending-requests-container">
      <h2>Pending Access Requests</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="request-list">
        {requests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <h3>Request #{request.id}</h3>
              <span className="status-badge pending">Pending</span>
            </div>
            
            <div className="request-details">
              <p><strong>User:</strong> {request.user.username}</p>
              <p><strong>Software:</strong> {request.software.name}</p>
              <p><strong>Access Type:</strong> {request.accessType}</p>
              <p><strong>Reason:</strong> {request.reason}</p>
              <p><strong>Requested:</strong> {new Date(request.createdAt).toLocaleString()}</p>
            </div>
            
            <div className="request-actions">
              <button 
                className="btn btn-approve" 
                onClick={() => handleUpdateStatus(request.id, 'Approved')}
                disabled={processing}
              >
                Approve
              </button>
              <button 
                className="btn btn-reject" 
                onClick={() => handleUpdateStatus(request.id, 'Rejected')}
                disabled={processing}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequests;