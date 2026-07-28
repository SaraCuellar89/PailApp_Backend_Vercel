const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;


// ===== Auth Middleware =====
const auth = (req, res, next) => {
  try {
    const authHeader  = req.headers.authorization;

    if (!authHeader ) {
      return res.status(401).json({
        succes: false,
        message: "Token requerido"
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token inválido"
      });
    }

    const decoded = jwt.verify(token, SECRET);

    // Pasar la información del usuario autenticado a req.usuario para usarla en el backend
    req.usuario = decoded;

    next();

  } catch (error) {
    console.error('Error: ' + error)
    return res.status(401).json({
        succes: false,
        message: "Token inválido"
    });
  }
};


module.exports = {auth};