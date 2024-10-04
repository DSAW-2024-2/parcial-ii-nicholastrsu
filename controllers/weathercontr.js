const axios = require('axios');

const getWeather = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Faltan parámetros de latitud y longitud' });
  }

  try {
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude,
        longitude,
        current_weather: true
      }
    });
    
    const { temperature } = response.data.current_weather;
    return res.json({ temperature });
  } catch (error) {
    return res.status(500).json({ message: 'Error al consultar el clima' });
  }
};

module.exports = { getWeather };
