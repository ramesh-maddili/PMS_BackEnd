const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Jwt = require('@hapi/jwt'); // modern JWT plugin
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  // Register the JWT plugin
  await server.register(Jwt);

  //  Define JWT strategy
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 3600
    },
    validate: (artifacts, request, h) => {
      // `artifacts.decoded.payload` contains the JWT claims
      return {
        isValid: true,
        credentials: artifacts.decoded.payload
      };
    }
  });

  server.auth.default('jwt'); // Set default strategy

  // Register your routes
  await server.register([authRoutes, productRoutes]);
  server.route(categoryRoutes);

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
