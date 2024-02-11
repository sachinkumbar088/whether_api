// index.js

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const locationController = require('./src/controllers/locationController');
const weatherController = require('./src/controllers/weatherController');
const errorMiddleware = require('./src/middleware/errorMiddleware');
const logger = require('./src/utils/logger');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/weatherApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});
db.once('open', () => {
  logger.info('Connected to MongoDB');
});

// Logging middleware
app.use(morgan('dev'));

// Body parser middleware
app.use(bodyParser.json());

// Routes
app.use('/locations', locationController);
app.use('/weather', weatherController);

// Error handling middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
