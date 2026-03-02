// ================== Importacion de funciones de error o exito ================== 
const {respuesta_exito,
    respuesta_error,
    respuesta_error_servidor} = require('../utils/responses');


// ================== Importacion de modelos ==================
const {crear_token} = require('../models/token_fcm_model');


// ================== Funciones del controlador ==================

// Guardar token de dispositivo para hacer push notification
const guardar_token = async (req, res) => {
    try {
        const {fcm_token} = req.body;
        const id_usuario = req.usuario.id_usuario;

        const resultado = await crear_token({id_usuario, fcm_token});

        return respuesta_exito(res, "Token FCM guardado correctamente", 200, resultado);

    } catch (error) {
        return respuesta_error_servidor(res, error, 'No se pudo guardar el token FCM', 500);
    }
}



// ================== Exportar funciones ==================
module.exports = {
    guardar_token
}