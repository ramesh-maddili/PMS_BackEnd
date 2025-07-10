require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product'); // Adjust path as needed

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany();

    const products = [
      { name: "iPhone 14", price: 79999, category: "Electronics" },
      { name: "Samsung Galaxy S22", price: 69999, category: "Electronics" },
      { name: "Sony Headphones", price: 9999, category: "Electronics" },
      { name: "T-shirt", price: 699, category: "Clothing" },
      { name: "Jeans", price: 1999, category: "Clothing" },
      { name: "Formal Shirt", price: 1499, category: "Clothing" },
      { name: "Running Shoes", price: 2999, category: "Footwear" },
      { name: "Sneakers", price: 3499, category: "Footwear" },
      { name: "Leather Belt", price: 799, category: "Accessories" },
      { name: "Wrist Watch", price: 2499, category: "Accessories" }
    ];

    await Product.insertMany(products);
    console.log(" Products seeded successfully");
  } catch (err) {
    console.error(" Error seeding products:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
