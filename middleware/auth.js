// import jwt from 'jsonwebtoken';
// import Admin from '../models/Admin.js';

// const authMiddleware = async (req, res, next) => {
//   // Get token from header
//   const token = req.header('x-auth-token');

//   // Check if no token
//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Get admin from token
//     req.admin = await Admin.findById(decoded.id).select('-password');
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// export default authMiddleware;

import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if no token or malformed
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the admin from DB, excluding password
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    next(); // Continue to the route
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
