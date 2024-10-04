require('dotenv').config();
const express = require('express');
const app = express();
const loginhRoutes = require('./routes/login');
const weatherRoutes = require('./routes/weather');

app.use(express.json());

app.use('/api', loginRoutes);
app.use('/api', weatherRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;

