const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');


const weatherRouter = express.Router();


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Se requiere un token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
}


const isValidCoordinate = (value) => typeof value === 'string' && !isNaN(value);


weatherRouter.get('/', authenticateToken, async (req, res) => {
  const { latitude, longitude } = req.query;


  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Debe proporcionar latitud y longitud' });
  }

  if (!isValidCoordinate(latitude) || !isValidCoordinate(longitude)) {
    return res.status(400).json({ message: 'Valores inválidos para latitud o longitud' });
  }

  try {
    const weatherData = await getWeatherData(latitude, longitude);
    return res.json({ temperature: weatherData.current_weather.temperature });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los datos del clima', error: error.message });
  }
});


async function getWeatherData(latitude, longitude) {
  const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude,
      longitude,
      current_weather: true
    }
  });
  return response.data;
}

module.exports = weatherRouter;
