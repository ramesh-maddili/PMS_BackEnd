const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config(); //

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const users = [
      { username: 'Ramesh', password: await bcrypt.hash('ramesh123', 10), role: 'Admin' },
      { username: 'Aswini', password: await bcrypt.hash('aswini123', 10), role: 'User' },
      { username: 'Vamsi',  password: await bcrypt.hash('vamsi123',  10), role: 'User' },
      { username: 'Sajad',  password: await bcrypt.hash('sajad123',  10), role: 'User' },
      { username: 'Vivek',  password: await bcrypt.hash('vivek123',  10), role: 'User' }
    ];

    //await User.deleteMany(); // Optional cleanup
    await User.insertMany(users);

    console.log('✅ Users seeded with hashed passwords');
  } catch (err) {
    console.error('❌ Error seeding users:', err.message);
  } finally {
    mongoose.disconnect();
  }
};

seedUsers();
