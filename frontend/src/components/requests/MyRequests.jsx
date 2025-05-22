import React, { useState, useEffect } from 'react';
import { 
  FiClock, 
  FiCheck, 
  FiX, 
  FiLoader, 
  FiFileText, 
  FiCalendar, 
  FiUser,
  FiFilter,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi';
import requestService from '../../services/requestService';
import { useAuth } from '../../contexts/AuthContext';
import './MyRequests.scss';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchUserRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await requestService.getUserRequests();
      setRequests(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to refresh requests');
    }
    setRefreshing(false);
  };

  const filterRequests = () => {
    let filtered = requests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.accessType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => 
        request.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredRequests(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <FiCheck className="status-icon" />;
      case 'rejected':
        return <FiX className="status-icon" />;
      default:
        return <FiClock className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="my-requests">
        <div className="loading-container">
          <FiLoader className="loading-spinner" />
          <p>Loading your requests...</p>
        </div>
      </div>
    );
  }

  if (error && requests.length === 0) {
    return (
      <div className="my-requests">
        <div className="error-container">
          <FiX className="error-icon" />
          <h3>Error Loading Requests</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchUserRequests}>
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-requests">
      <div className="my-requests__header">
        <div className="header-content">
          <h1 className="page-title">
            <FiFileText className="title-icon" />
            My Access Requests
          </h1>
          <p className="page-subtitle">
            Track and manage your software access requests
          </p>
        </div>
        
        <button 
          className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FiRefreshCw className={refreshing ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <FiFileText className="empty-icon" />
          <h3>No Requests Yet</h3>
          <p>You haven't made any access requests yet.</p>
        </div>
      ) : (
        <>
          <div className="filters-section">
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-container">
              <FiFilter className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="requests-stats">
            <div className="stat-item">
              <span className="stat-number">{requests.length}</span>
              <span className="stat-label">Total Requests</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {requests.filter(r => r.status.toLowerCase() === 'pending').length}
              </span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {requests.filter(r => r.status.toLowerCase() === 'approved').length}
              </span>
              <span className="stat-label">Approved</span>
            </div>
          </div>

          <div className="requests-grid">
            {filteredRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="card-header">
                  <div className="request-id">
                    <span className="id-label">Request</span>
                    <span className="id-number">#{request.id}</span>
                  </div>
                  <div className={`status-badge ${getStatusClass(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span>{request.status}</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="software-info">
                    <h3 className="software-name">{request.software.name}</h3>
                    <span className="access-type">{request.accessType}</span>
                  </div>

                  <div className="request-reason">
                    <p>{request.reason}</p>
                  </div>

                  <div className="request-meta">
                    <div className="meta-item">
                      <FiCalendar className="meta-icon" />
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                    <div className="meta-item">
                      <FiUser className="meta-icon" />
                      <span>Requested by you</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="progress-indicator">
                    <div className={`progress-step ${request.status ? 'completed' : ''}`}>
                      <div className="step-circle">1</div>
                      <span>Submitted</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${request.status === 'Approved' || request.status === 'Rejected' ? 'completed' : ''}`}>
                      <div className="step-circle">2</div>
                      <span>Reviewed</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRequests.length === 0 && requests.length > 0 && (
            <div className="no-results">
              <FiSearch className="no-results-icon" />
              <h3>No matching requests</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyRequests;