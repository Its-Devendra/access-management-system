import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import softwareService from '../../services/softwareService';
import requestService from '../../services/requestService';
import { useAuth } from '../../contexts/AuthContext';
import './CreateRequest.scss';

const CreateRequest = () => {
  const [formData, setFormData] = useState({
    softwareId: '',
    accessType: '',
    reason: ''
  });
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Redirect if not employee
  if (currentUser?.role !== 'Employee') {
    navigate('/');
    return null;
  }

  useEffect(() => {
    // Fetch software list on component mount
    const fetchSoftware = async () => {
      try {
        const data = await softwareService.getAllSoftware();
        setSoftware(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load software list');
        setLoading(false);
      }
    };

    fetchSoftware();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // If software selection changes, reset access type
    if (name === 'softwareId') {
      setFormData((prev) => ({ ...prev, accessType: '' }));
    }
  };

  const getAccessLevelsForSelectedSoftware = () => {
    const selectedSoftware = software.find(
      (s) => s.id === parseInt(formData.softwareId)
    );
    return selectedSoftware ? selectedSoftware.accessLevels : [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setSuccess(false);

    try {
      const { softwareId, accessType, reason } = formData;
      
      // Validate input
      if (!softwareId || !accessType || !reason) {
        throw new Error('All fields are required');
      }
      
      // Create request
      await requestService.createRequest({
        softwareId: parseInt(softwareId),
        accessType,
        reason
      });
      
      setSuccess(true);
      setFormData({
        softwareId: '',
        accessType: '',
        reason: ''
      });
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading software...</div>;
  }

  if (software.length === 0) {
    return <div className="no-data">No software available to request access.</div>;
  }

  return (
    <div className="create-request-container">
      <h2>Request Software Access</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Access request submitted successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="softwareId">Select Software</label>
          <select
            id="softwareId"
            name="softwareId"
            value={formData.softwareId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Software --</option>
            {software.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        
        {formData.softwareId && (
          <div className="form-group">
            <label htmlFor="accessType">Access Type</label>
            <select
              id="accessType"
              name="accessType"
              value={formData.accessType}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Access Type --</option>
              {getAccessLevelsForSelectedSoftware().map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="reason">Reason for Request</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            placeholder="Explain why you need access to this software"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default CreateRequest;