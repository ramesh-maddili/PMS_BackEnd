const User = require('../models/User');
const bcrypt = require('bcrypt'); // 
const jwt = require('jsonwebtoken');

// Helper to generate access & refresh tokens
const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '45min' });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '5d'
  });

  return { token, refreshToken };
};

exports.login = async (request, h) => {
  try {
    const { username, email, password } = request.payload;

    // Validate user existence
    const user = await User.findOne({ username, email });
    if (!user) {
      return h.response({ message: 'Invalid credentials' }).code(401);
    }

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return h.response({ message: 'Invalid credentials' }).code(401);
    }

    // Generate access and refresh tokens
    const { token, refreshToken } = generateTokens(user);

    return h.response({
      token,
      refreshToken,
      role: user.role,
      email: user.email,
      username: user.username
    }).code(200);

  } catch (error) {
    console.error('Login error:', error.message);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};

exports.refreshToken = async (request, h) => {
  try {
    const { refreshToken } = request.payload;
    if (!refreshToken) {
      return h.response({ message: 'Refresh token missing' }).code(400);
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return h.response({ message: 'User not found' }).code(404);
    }

    const newTokens = generateTokens(user);
    return h.response(newTokens).code(200);
  } catch (err) {
    console.error('Refresh token error:', err.message);
    return h.response({ message: 'Invalid refresh token' }).code(401);
  }
};

exports.getAllUsers = async (request, h) => {
  const users = await User.find({}, { password: 0 }); // exclude passwords
  return h.response(users).code(200);
};

exports.getUserById = async (request, h) => {
  try {
    const { id } = request.params;
    const user = await User.findById(id, { password: 0 });

    if (!user) {
      return h.response({ message: 'User not found' }).code(404);
    }

    return h.response(user).code(200);
  } catch (err) {
    console.error('Get user error:', err.message);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
};

exports.updateUser = async (request, h) => {
  const { id } = request.params;
  const payload = request.payload;

  const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true });
  if (!updatedUser) {
    return h.response({ message: 'User not found' }).code(404);
  }

  return h.response(updatedUser);
};
