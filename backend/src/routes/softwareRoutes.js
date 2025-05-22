const express = require('express');
const router = express.Router();
const softwareController = require('../controllers/softwareController');
const authenticateUser = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

// Software routes
// Create software - Admin only
router.post(
  '/', 
  authenticateUser, 
  authorizeRoles('Admin'), 
  softwareController.createSoftware
);

// Get all software - Any authenticated user
router.get(
  '/', 
  authenticateUser, 
  softwareController.getAllSoftware
);

// Get software by ID - Any authenticated user
router.get(
  '/:id', 
  authenticateUser, 
  softwareController.getSoftwareById
);

module.exports = router;