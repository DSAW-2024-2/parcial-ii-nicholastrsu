const express = require('express');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();


const VALID_USER = Object.freeze({
  email: 'admin@admin.com',
  password: 'admin'
});


authRouter.post('/', (req, res) => {
  const credentials = req.body;


  if (isValidUser(credentials)) {

    const sessionToken = generateToken(credentials.email);
    return res.status(200).json({ message: 'Autenticación correcta', token: sessionToken });
  }


  res.status(401).json({ message: 'Credenciales incorrectas' });
});


function isValidUser({ email, password }) {
  return email === VALID_USER.email && password === VALID_USER.password;
}

function generateToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = authRouter;

