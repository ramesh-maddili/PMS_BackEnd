//test3
const Product = require('../models/Product');

exports.getAll = async (request, h) => {
  const products = await Product.find();
  return products;
};
exports.get = async (request, h) => {
  const id = request.params.id;

  try {
    const singleProduct = await Product.findById(id);
    if (!singleProduct) {
      return h.response({ message: 'Product not found' }).code(404);
    }
    return h.response(singleProduct).code(200);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    return h.response({ message: 'Server error' }).code(500);
  }
};

exports.create = async (request, h) => {
  const product = new Product(request.payload);
  await product.save();
  return product;
};

exports.update = async (request, h) => {
  const updated = await Product.findByIdAndUpdate(request.params.id, request.payload, { new: true });
  return updated;
};

exports.delete = async (request, h) => {
  await Product.findByIdAndDelete(request.params.id);
  return { message: 'Deleted' };
};

exports.summary = async (request, h) => {
  const category = request.query.category;
  const matchStage = category ? { $match: { category } } : null;

  const pipeline = [
    ...(matchStage ? [matchStage] : []),
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ];

  const result = await Product.aggregate(pipeline);
  return result;
};
