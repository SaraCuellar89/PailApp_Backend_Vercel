// ----- Respuestas de éxito -----
const respuesta_exito = (res, message, status = 200, data = []) => {
    return res.status(status).json({
        success: true,
        message,
        data
    });
};

// ----- Respuestas de error controlado -----
const respuesta_error = (res, message, status = 400, data = []) => {
    return res.status(status).json({
        success: false,
        message,
        data
    });
};

// ----- Error interno -----
const respuesta_error_servidor = (res, error, message = 'Error interno del servidor') => {
    console.error('Error:', error);

    return res.status(500).json({
        success: false,
        message
    });
};


module.exports = {
    respuesta_exito,
    respuesta_error,
    respuesta_error_servidor
}
