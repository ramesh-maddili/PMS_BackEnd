const jwt = require('jsonwebtoken');

module.exports = (role = null) => {
  return async (request, h) => {
    try {
        //const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      const token = request.headers.authorization?.split(' ')[1];
      if (!token) throw new Error();

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (role && decoded.role !== role) throw new Error();

      request.auth = decoded;
      return h.continue;
    } catch {
      return h.response({ message: "Unauthorized" }).code(401).takeover();
    }
  };
};
