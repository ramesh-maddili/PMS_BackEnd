const productController = require('../controllers/ProductController');
const verifyToken = require('../middleware/verifyToken');

exports.plugin = {
  name: 'productRoutes',
  register: (server) => {
    server.route([
      { method: 'GET', path: '/products/getall', handler: productController.getAll, options: { pre: [verifyToken()] } },
      { method: 'GET', path: '/products/get/{id}', handler: productController.get, options: { pre: [verifyToken('Admin')] } },
      { method: 'POST', path: '/products/create', handler: productController.create, options: { pre: [verifyToken('Admin')] } },
      { method: 'PUT', path: '/products/{id}', handler: productController.update, options: { pre: [verifyToken('Admin')] } },
      { method: 'DELETE', path: '/products/{id}', handler: productController.delete, options: { pre: [verifyToken('Admin')] } },
      { method: 'GET', path: '/summary', handler: productController.summary, options: { pre: [verifyToken('Admin')] } },
    ]);
  }
};
