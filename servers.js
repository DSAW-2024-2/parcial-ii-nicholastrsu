require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', weatherRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;

