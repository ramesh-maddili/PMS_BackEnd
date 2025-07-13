const jwt = require('jsonwebtoken');

module.exports = (role = null) => {
  return async (request, h) => {
    try {
      const authHeader = request.headers.authorization;
      console.log('Authorization Header:', authHeader);

      const token = authHeader?.split(' ')[1];
      if (!token) throw new Error('Missing token');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded);

      if (role && decoded.role !== role) throw new Error('Insufficient permissions');

      request.auth = decoded;
      return h.continue;
    } catch (err) {
      console.error('Token validation failed:', err.message);
      return h.response({ message: 'Unauthorized' }).code(401).takeover();
    }
  };
};
