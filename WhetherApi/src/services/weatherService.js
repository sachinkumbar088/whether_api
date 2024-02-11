// services/weatherService.js

const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache();
const WHETHER_API_KEY = "7edb71bc6f079b530c94b36e642a2419";

const fetchWeatherData = async (latitude, longitude, startDate, endDate) => {
  // Check if startDate and endDate are present
  if (startDate && endDate) {
    const cacheKey = `${latitude},${longitude},${startDate.toISOString()},${endDate.toISOString()}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      // Adjust the API endpoint to fetch historical weather data based on latitude, longitude, startDate, and endDate
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${latitude}&lon=${longitude}&start=${
          startDate.getTime() / 1000
        }&end=${endDate.getTime() / 1000}&appid=${WHETHER_API_KEY}`
      );
      const weatherData = response.data;
      cache.set(cacheKey, weatherData, 300); // Cache for 5 minutes
      return weatherData;
    } catch (error) {
      throw new Error("Failed to fetch historical weather data");
    }
  } else {
    // If startDate or endDate is not provided, fallback to fetching current weather data
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WHETHER_API_KEY}`
      );
      const weatherData = response.data;
      cache.set(cacheKey, weatherData, 300); // Cache for 5 minutes
      return weatherData;
    } catch (error) {
      throw new Error("Failed to fetch current weather data");
    }
  }
};

module.exports = { fetchWeatherData };
