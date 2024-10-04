const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const SECRET_KEY = 'your_secret_key'; 

const users = {
  'admin@admin.com': 'admin'
};

function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).send('Token no proporcionado.');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Token inválido.');
    req.user = user;
    next();
  });
}


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (users[email] && users[email] === password) {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).send('Credenciales incorrectas.');
});


app.get('/weather', authenticateToken, async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).send('Los parámetros latitude y longitude son requeridos.');
  }

  try {
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude,
        longitude,
        current_weather: true
      }
    });
    const temperature = response.data.current_weather.temperature;
    res.json({ temperature });
  } catch (error) {
    res.status(500).send('Error al consultar la API de Open Meteo.');
  }
});


app.use((req, res) => {
  res.status(404).send('Ruta no encontrada.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

