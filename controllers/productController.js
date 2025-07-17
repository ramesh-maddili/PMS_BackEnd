
const Product = require('../models/Product');

const getAll = async (req, h) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const search = req.query.search || '';

    const filter = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return h.response({
      data: products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error("Product fetch error:", err.message);
    return h.response({ message: "Server error" }).code(500);
  }
};
exports.getAll = getAll;
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
  console.log("Product Added" )
  //return h.response({message:"Product Saved"}).code(201)
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
