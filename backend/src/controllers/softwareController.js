const { getRepository } = require('typeorm');

// Controller for software management
exports.createSoftware = async (req, res) => {
  try {
    const softwareRepository = getRepository('Software');
    const { name, description, accessLevels } = req.body;

    // Validate input
    if (!name || !description || !accessLevels || !Array.isArray(accessLevels)) {
      return res.status(400).json({ 
        message: 'Name, description, and accessLevels array are required' 
      });
    }

    // Validate access levels
    const validAccessLevels = ['Read', 'Write', 'Admin'];
    const areValidLevels = accessLevels.every(level => 
      validAccessLevels.includes(level));

    if (!areValidLevels) {
      return res.status(400).json({ 
        message: 'Access levels must be one of: Read, Write, Admin' 
      });
    }

    // Create new software
    const newSoftware = await softwareRepository.save({
      name,
      description,
      accessLevels
    });

    res.status(201).json({
      message: 'Software created successfully',
      software: newSoftware
    });
  } catch (error) {
    console.error('Create software error:', error);
    res.status(500).json({ message: 'Server error during software creation' });
  }
};

exports.getAllSoftware = async (req, res) => {
  try {
    const softwareRepository = getRepository('Software');
    const software = await softwareRepository.find();

    res.json({ software });
  } catch (error) {
    console.error('Get software error:', error);
    res.status(500).json({ message: 'Server error while retrieving software' });
  }
};

exports.getSoftwareById = async (req, res) => {
  try {
    const softwareRepository = getRepository('Software');
    const { id } = req.params;
    
    const software = await softwareRepository.findOne({ where: { id } });
    
    if (!software) {
      return res.status(404).json({ message: 'Software not found' });
    }
    
    res.json({ software });
  } catch (error) {
    console.error('Get software by ID error:', error);
    res.status(500).json({ message: 'Server error while retrieving software' });
  }
};