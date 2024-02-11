// controllers/weatherController.js

const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const Location = require("../models/Location");

const { fetchWeatherData } = require("../services/weatherService.js");

// Now you can use the fetchWeatherData function in this file

// Get weather forecast for a specific location
router.get("/:location_id", async (req, res) => {
  const { location_id } = req.params;

  try {
    // Retrieve location details from the database based on location_id
    const location = await Location.findById(location_id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    // Use latitude and longitude from the retrieved location to fetch weather data
    const { latitude, longitude } = location;
    console.log(latitude, "latitude", longitude);

    // Fetch weather data using latitude and longitude
    const weatherData = await fetchWeatherData(latitude, longitude);
    logger.info(
      `GET request received for weather data of location ${location_id}`
    );
    res.json(weatherData);
  } catch (error) {
    logger.error("Error getting weather data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Get historical weather data and show summary
router.get("/history/:location_id/:days", async (req, res) => {
  const { location_id, days } = req.params;

  try {
    // Calculate the date range based on the number of days

    // Retrieve location details from the database based on location_id
    const location = await Location.findById(location_id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    // Use latitude and longitude from the retrieved location to fetch weather data
    const { latitude, longitude } = location;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Fetch historical weather data using the fetchWeatherData function
    const historicalData = await fetchWeatherData(
      latitude,
      longitude,
      startDate,
      endDate
    );

    // Calculate summary statistics (e.g., average temperature, max humidity, etc.)
    // Implement your logic here based on the historicalData

    logger.info(
      `GET request received for historical weather data for the last ${days} days`
    );
    res.json({ historicalData, summary: "testing" });
  } catch (error) {
    logger.error("Error getting historical weather data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
