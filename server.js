const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']  // For frontend access
      }
    }
  });

  await server.register([authRoutes, productRoutes]);

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
