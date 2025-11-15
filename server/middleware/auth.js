const jwt = require('jsonwebtoken');

const JWT_SECRET = 'твой_секретный_ключ_для_jwt'; 
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; 
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Неверный токен' });
  }
};

module.exports = { authMiddleware, JWT_SECRET };
