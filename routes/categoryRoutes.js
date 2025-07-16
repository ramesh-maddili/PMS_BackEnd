const Category = require('../models/Category');

module.exports = [
  // Create a new category
  {
    method: 'POST',
    path: '/categories/create',
    handler: async (request, h) => {
      try {
        const { name } = request.payload;

        const existing = await Category.findOne({ name });
        if (existing) {
          return h.response({ message: 'Category already exists' }).code(400);
        }

        const category = new Category({ name });
        const saved = await category.save();

        return h.response(saved).code(201);
      } catch (err) {
        console.error('Category creation failed:', err);
        return h.response({ message: 'Internal Server Error' }).code(500);
      }
    }
  },

  // Get all categories
  {
    method: 'GET',
    path: '/categories',
    handler: async (request, h) => {
      try {
        const categories = await Category.find().sort({ name: 1 });
        return h.response(categories).code(200);
      } catch (err) {
        console.error('Fetching categories failed:', err);
        return h.response({ message: 'Internal Server Error' }).code(500);
      }
    }
  }
];
