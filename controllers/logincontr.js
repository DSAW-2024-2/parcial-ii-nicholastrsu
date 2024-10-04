const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@admin.com' && password === 'admin') {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  
  return res.status(401).json({ message: 'Credenciales incorrectas' });
};

module.exports = { login };
