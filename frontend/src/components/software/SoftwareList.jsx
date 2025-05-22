import React, { useState, useEffect } from 'react';
import softwareService from '../../services/softwareService';

const SoftwareList = () => {
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return <div className="loading">Loading software...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (software.length === 0) {
    return <div className="no-data">No software available.</div>;
  }

  return (
    <div className="software-list-container">
      <h2>Available Software</h2>
      <div className="software-list">
        {software.map((item) => (
          <div key={item.id} className="software-card">
            <h3>{item.name}</h3>
            <p className="description">{item.description}</p>
            <div className="access-levels">
              <strong>Available Access Levels:</strong>
              <ul>
                {item.accessLevels.map((level) => (
                  <li key={level}>{level}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoftwareList;