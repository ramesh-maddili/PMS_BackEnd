const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

exports.login = async (request, h) => {
  const { username, password } = request.payload;

  const user = await User.findOne({ username });

  if (!user) {
    console.log('User not found:', username);
    return h.response({ message: 'Invalid credentials' }).code(401);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log('Password does not match for user:', username);
    return h.response({ message: 'Invalid credentials' }).code(401);
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return { token, role: user.role };
};
