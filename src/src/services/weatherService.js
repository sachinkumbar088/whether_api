// services/weatherService.js

const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache();

const fetchWeatherData = async (latitude, longitude, startDate, endDate) => {
    const cacheKey = `${latitude},${longitude},${startDate.toISOString()},${endDate.toISOString()}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        // Adjust the API endpoint to fetch historical weather data based on latitude, longitude, startDate, and endDate
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${latitude}&lon=${longitude}&start=${startDate.getTime() / 1000}&end=${endDate.getTime() / 1000}&appid=YOUR_API_KEY`);
        const weatherData = response.data;
        cache.set(cacheKey, weatherData, 300); // Cache for 5 minutes
        return weatherData;
    } catch (error) {
        throw new Error('Failed to fetch weather data');
    }
};

module.exports = { fetchWeatherData };
