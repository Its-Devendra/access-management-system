const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Request service
const requestService = {
  // Create new access request (Employee only)
  createRequest: async (requestData) => {
    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create request');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's requests
  getUserRequests: async () => {
    try {
      const response = await fetch(`${API_URL}/requests/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user requests');
      }

      return data.requests;
    } catch (error) {
      throw error;
    }
  },

  // Get pending requests (Manager only)
  getPendingRequests: async () => {
    try {
      const response = await fetch(`${API_URL}/requests/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pending requests');
      }

      return data.requests;
    } catch (error) {
      throw error;
    }
  },

  // Update request status (Manager only)
  updateRequestStatus: async (requestId, status) => {
    try {
      const response = await fetch(`${API_URL}/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update request');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default requestService;