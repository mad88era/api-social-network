// const { connect, connection } = require('mongoose');

// const connectionString = 'mongodb://127.0.0.1:27017/socialNetworkApi';

// connect(connectionString);

// module.exports = connection;

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // await mongoose.connect('mongodb://127.0.0.1:27017/socialNetworkApi');
    await mongoose.connect('mongodb://localhost/socialNetworkApi');
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;