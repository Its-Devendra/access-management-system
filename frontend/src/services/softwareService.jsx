const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Software service
const softwareService = {
  // Get all software
  getAllSoftware: async () => {
    try {
      const response = await fetch(`${API_URL}/software`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch software');
      }

      return data.software;
    } catch (error) {
      throw error;
    }
  },

  // Get software by ID
  getSoftwareById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/software/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch software details');
      }

      return data.software;
    } catch (error) {
      throw error;
    }
  },

  // Create new software (Admin only)
  createSoftware: async (softwareData) => {
    try {
      const response = await fetch(`${API_URL}/software`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(softwareData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create software');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default softwareService;