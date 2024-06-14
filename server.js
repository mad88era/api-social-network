const express = require('express');
const connectDB = require('./config/connection');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;  // Use environment variable with a default fallback

// Middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Connect to MongoDB and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📦 MongoDB connected...');
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);  // Terminate the process if the database connection fails
});

// Handle 404 responses for undefined routes
app.use((req, res) => {
    res.status(404).send("404: Page not found");
});

// Error handling middleware for handling and logging errors
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log error stack for more detailed debugging
    res.status(err.status || 500).send(err.message || 'Internal Server Error');
});