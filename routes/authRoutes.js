const authController = require('../controllers/authController');

exports.plugin = {
  name: 'authRoutes',
  register: (server) => {
    server.route({
      method: 'POST',
      path: '/login',
      handler: authController.login
    });
  }
};
