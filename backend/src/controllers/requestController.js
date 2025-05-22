const { getRepository } = require('typeorm');

// Controller for access request management
exports.createRequest = async (req, res) => {
  try {
    const requestRepository = getRepository('Request');
    const userRepository = getRepository('User');
    const softwareRepository = getRepository('Software');
    
    const { softwareId, accessType, reason } = req.body;
    const userId = req.user.id;

    // Validate user
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate software
    const software = await softwareRepository.findOne({ where: { id: softwareId } });
    if (!software) {
      return res.status(404).json({ message: 'Software not found' });
    }

    // Validate access type
    if (!software.accessLevels.includes(accessType)) {
      return res.status(400).json({ 
        message: `Invalid access type. Choose from: ${software.accessLevels.join(', ')}` 
      });
    }

    // Create request
    const newRequest = await requestRepository.save({
      user: { id: userId },
      software: { id: softwareId },
      accessType,
      reason,
      status: 'Pending'
    });

    // Fetch the saved request with relationships
    const savedRequest = await requestRepository.findOne({
      where: { id: newRequest.id },
      relations: ['user', 'software']
    });

    res.status(201).json({
      message: 'Access request submitted',
      request: savedRequest
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error during request creation' });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const requestRepository = getRepository('Request');
    const userId = req.user.id;

    const requests = await requestRepository.find({
      where: { user: { id: userId } },
      relations: ['software']
    });

    res.json({ requests });
  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({ message: 'Server error while retrieving requests' });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requestRepository = getRepository('Request');

    const requests = await requestRepository.find({
      where: { status: 'Pending' },
      relations: ['user', 'software']
    });

    res.json({ requests });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ message: 'Server error while retrieving pending requests' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const requestRepository = getRepository('Request');
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Status must be either Approved or Rejected' 
      });
    }

    // Find request
    const request = await requestRepository.findOne({
      where: { id },
      relations: ['user', 'software']
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update status
    request.status = status;
    await requestRepository.save(request);

    res.json({
      message: `Request ${status.toLowerCase()} successfully`,
      request
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Server error during request update' });
  }
};