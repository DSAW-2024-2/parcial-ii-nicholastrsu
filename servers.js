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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
