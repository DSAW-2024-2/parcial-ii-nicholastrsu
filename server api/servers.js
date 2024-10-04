const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || 'mySecretKey';


const usersDB = [
    { email: 'admin@admin.com', password: 'admin' }
];


const generateToken = (user) => {
    return jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(403).json({ message: 'Access denied. Token required.' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
        req.user = user;
        next();
    });
};


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = usersDB.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    res.json({ token, message: 'Login successful!' });
});


app.get('/weather', authenticateToken, async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Missing latitude or longitude in query parameters.' });
    }

    try {
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude,
                longitude,
                current_weather: true
            }
        });

        const { temperature } = response.data.current_weather;
        res.json({ temperature, message: 'Weather data retrieved successfully.' });
    } catch (error) {
        console.error('Error fetching data from Open Meteo:', error);
        res.status(500).json({ message: 'Error fetching weather data.' });
    }
});


module.exports = app;
