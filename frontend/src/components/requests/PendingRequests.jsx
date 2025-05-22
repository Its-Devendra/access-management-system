import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import requestService from '../../services/requestService';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiClock, 
  FiUser, 
  FiPackage, 
  FiShield, 
  FiMessageCircle, 
  FiCalendar,
  FiCheck,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiInbox,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import './PendingRequests.scss';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Redirect if not manager
  if (currentUser?.role !== 'Manager') {
    navigate('/');
    return null;
  }

  useEffect(() => {
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
    setProcessingId(requestId);
    try {
      await requestService.updateRequestStatus(requestId, status);
      setRequests(requests.filter(request => request.id !== requestId));
    } catch (err) {
      setError(err.message || `Failed to ${status.toLowerCase()} request`);
    } finally {
      setProcessing(false);
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || request.accessType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="pending-requests">
        <div className="loading-container">
          <FiLoader className="loading-spinner" />
          <p>Loading pending requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pending-requests">
        <div className="error-container">
          <FiAlertCircle className="error-icon" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-requests">
      <div className="pending-requests__header">
        <div className="header-content">
          <div className="title-section">
            <FiClock className="title-icon" />
            <h1>Pending Access Requests</h1>
            <span className="requests-count">{requests.length} pending</span>
          </div>
          
          <div className="header-controls">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-dropdown">
              <FiFilter className="filter-icon" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="Read">Read Access</option>
                <option value="Write">Write Access</option>
                <option value="Admin">Admin Access</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <FiInbox className="empty-icon" />
          <h3>No pending requests</h3>
          <p>All requests have been processed or no requests match your search criteria.</p>
        </div>
      ) : (
        <div className="requests-grid">
          {filteredRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-card__header">
                <div className="request-id">
                  <span>Request #{request.id}</span>
                </div>
                <div className="status-badge status-badge--pending">
                  <FiClock />
                  Pending
                </div>
              </div>

              <div className="request-card__content">
                <div className="request-info">
                  <div className="info-item">
                    <FiUser className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Requested by</span>
                      <span className="info-value">{request.user.username}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FiPackage className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Software</span>
                      <span className="info-value">{request.software.name}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FiShield className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Access Type</span>
                      <span className={`access-type access-type--${request.accessType.toLowerCase()}`}>
                        {request.accessType}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FiCalendar className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Requested</span>
                      <span className="info-value">
                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="request-reason">
                  <div className="reason-header">
                    <FiMessageCircle className="reason-icon" />
                    <span className="reason-label">Reason</span>
                  </div>
                  <p className="reason-text">{request.reason}</p>
                </div>
              </div>

              <div className="request-card__actions">
                <button 
                  className="action-btn action-btn--approve"
                  onClick={() => handleUpdateStatus(request.id, 'Approved')}
                  disabled={processing}
                >
                  {processing && processingId === request.id ? (
                    <FiLoader className="btn-icon spinning" />
                  ) : (
                    <FiCheck className="btn-icon" />
                  )}
                  Approve
                </button>
                
                <button 
                  className="action-btn action-btn--reject"
                  onClick={() => handleUpdateStatus(request.id, 'Rejected')}
                  disabled={processing}
                >
                  {processing && processingId === request.id ? (
                    <FiLoader className="btn-icon spinning" />
                  ) : (
                    <FiX className="btn-icon" />
                  )}
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRequests;