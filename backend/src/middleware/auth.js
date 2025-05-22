const { verifyToken } = require('../utils/jwt');

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  const { valid, expired, decoded } = verifyToken(token);
  
  if (!valid) {
    return res.status(401).json({
      message: expired ? 'Token has expired' : 'Invalid token'
    });
  }
  
  req.user = decoded;
  next();
};

module.exports = authenticateUser;