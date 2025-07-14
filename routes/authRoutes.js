const authController = require('../controllers/authController');
const Boom = require('@hapi/boom');

exports.plugin = {
  name: 'authRoutes',
  register: async function (server) {
    server.route([
      {
        method: 'POST',
        path: '/register',
        options: { auth: false },
        handler: authController.register
      },
      {
        method: 'POST',
        path: '/refresh-token',
        options: { auth: false }, // no JWT required
        handler: authController.refreshToken
      },
      {
        method: 'POST',
        path: '/login',
        options: { auth: false }, // login should NOT require a token
        handler: authController.login
      },
      {
        method: 'GET',
        path: '/users',
        options: {
          auth: 'jwt',
          handler: authController.getAllUsers,
          pre: [
            {
              method: (request, h) => {
                if (request.auth.credentials.role !== 'Admin') {
                  throw Boom.forbidden('Access denied. Admins only.');
                }
                return h.continue;
              }
            }
          ]
        }
      },
      {
        method: 'GET',
        path: '/users/{id}',
        options: {
          auth: 'jwt',
          handler: authController.getUserById,
          pre: [
            {
              method: (request, h) => {
                if (request.auth.credentials.role !== 'Admin') {
                  throw Boom.forbidden('Access denied. Admins only.');
                }
                return h.continue;
              }
            }
          ]
        }
      }
    ]);
  }
};
