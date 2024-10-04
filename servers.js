const express = require('express');
const dotenv = require('dotenv');
const loginRouter = require('./routes/login');
const weatherRouter = require('./routes/weather');

dotenv.config();
const app = express();

app.use(express.json());

app.use('/api/login', loginRouter);
app.use('/api/weather', weatherRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Esta ruta no existe' });
});

module.exports = app;
