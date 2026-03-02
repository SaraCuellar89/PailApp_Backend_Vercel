const rateLimit = require('express-rate-limit');


// Limite de 5 intentos para solicitar codigo de recuperacion
const limite_recuperacion = rateLimit({
    windowMs: 60 * 60 * 1000, // ventana de 1 hora
    max: 5, // máximo 5 intentos por hora
    message: {
        success: false,
        mensaje: 'Demasiados intentos, espera una hora antes de volver a intentarlo'
    },
    standardHeaders: true,
    legacyHeaders: false
});


// Limite de 10 intentos para iniciar sesion
const limite_inicio_sesion = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,
    message: {
        success: false,
        mensaje: 'Demasiados intentos, espera 15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false
});


module.exports = { 
    limite_recuperacion,
    limite_inicio_sesion
};