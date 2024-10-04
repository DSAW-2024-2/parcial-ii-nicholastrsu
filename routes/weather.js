const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/weather', authMiddleware, getWeather);

module.exports = router;
