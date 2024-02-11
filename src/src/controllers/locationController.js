// controllers/locationController.js

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const Location = require('../models/Location');

// Add a new location
router.post('/', async (req, res) => {
  const { name, latitude, longitude } = req.body;

  try {
    const newLocation = await Location.create({ name, latitude, longitude });
    logger.info(`Location added: ${newLocation}`);
    res.status(201).json(newLocation);
  } catch (error) {
    logger.error('Error adding location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    logger.info('GET request received for /locations');
    res.json(locations);
  } catch (error) {
    logger.error('Error getting locations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific location by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    logger.info(`GET request received for /locations/${id}`);
    res.json(location);
  } catch (error) {
    logger.error('Error getting location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a location by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, latitude, longitude } = req.body;

  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      { name, latitude, longitude },
      { new: true }
    );
    if (!updatedLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }
    logger.info(`Location updated: ${updatedLocation}`);
    res.json(updatedLocation);
  } catch (error) {
    logger.error('Error updating location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a location by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLocation = await Location.findByIdAndDelete(id);
    if (!deletedLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }
    logger.info(`Location deleted: ${deletedLocation}`);
    res.json(deletedLocation);
  } catch (error) {
    logger.error('Error deleting location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
