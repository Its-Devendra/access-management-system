const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authenticateUser = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

// Request routes
// Create request - Employee only
router.post(
  '/', 
  authenticateUser, 
  authorizeRoles('Employee'), 
  requestController.createRequest
);

// Get user's requests - Any authenticated user
router.get(
  '/user', 
  authenticateUser, 
  requestController.getUserRequests
);

// Get pending requests - Manager only
router.get(
  '/pending', 
  authenticateUser, 
  authorizeRoles('Manager'), 
  requestController.getPendingRequests
);

// Update request status - Manager only
router.patch(
  '/:id', 
  authenticateUser, 
  authorizeRoles('Manager'), 
  requestController.updateRequestStatus
);

module.exports = router;