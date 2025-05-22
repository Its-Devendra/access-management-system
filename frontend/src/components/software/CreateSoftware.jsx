import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import softwareService from '../../services/softwareService';
import { useAuth } from '../../contexts/AuthContext';

const CreateSoftware = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accessLevels: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Redirect if not admin
  if (currentUser?.role !== 'Admin') {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccessLevelChange = (level) => {
    setFormData((prev) => {
      const updatedLevels = prev.accessLevels.includes(level)
        ? prev.accessLevels.filter((l) => l !== level)
        : [...prev.accessLevels, level];
      
      return { ...prev, accessLevels: updatedLevels };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      const { name, description, accessLevels } = formData;
      
      // Validate input
      if (!name || !description || accessLevels.length === 0) {
        throw new Error('Name, description, and at least one access level are required');
      }
      
      // Create software
      await softwareService.createSoftware(formData);
      
      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        accessLevels: []
      });
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to create software. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-software-container">
      <h2>Create New Software</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Software created successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Software Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Access Levels</label>
          <div className="checkbox-group">
            {['Read', 'Write', 'Admin'].map((level) => (
              <div key={level} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`level-${level}`}
                  checked={formData.accessLevels.includes(level)}
                  onChange={() => handleAccessLevelChange(level)}
                />
                <label htmlFor={`level-${level}`}>{level}</label>
              </div>
            ))}
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Software'}
        </button>
      </form>
    </div>
  );
};

export default CreateSoftware;