// ================== Importacion de funciones de error o exito ================== 
const {respuesta_exito,
    respuesta_error,
    respuesta_error_servidor} = require('../utils/responses');


// ================== Importacion de modelos ==================
const {listar_notificacion_id,
    listar_todas_notificaciones,
    eliminar_notificacion,
    eliminar_todas_notificacion} = require('../models/notificaciones_model');


// ================== Funciones del controlador ==================

// Obtener una notificacion por su ID
const obtener_notificacion_id = async (req, res) => {
    try {
        const {id_notificacion} = req.params;
        
        const [notificacion] = await listar_notificacion_id({id_notificacion});

        if(notificacion.length == 0){
            return respuesta_error(res, "No existe esa notificacion", 404);
        }

        return respuesta_exito(res, "Notificacion por ID", 200, notificacion);
    } 
    catch (error) {
        return respuesta_error_servidor(res, error, "No se pudo obtener la notificacion por su id");    
    }
}


// Obtener todas las notificacion con el ID del usuario
const obtener_todas_notificaciones = async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario;

        const notificaciones = await listar_todas_notificaciones({id_usuario});
        
        if(notificaciones.info_notificaciones.length == 0){
            return respuesta_error(res, "No hay notificaciones", 404);
        }

        return respuesta_exito(res, "Notificaciones", 200, notificaciones);
    } 
    catch(error) {
        return respuesta_error_servidor(res, error, "No se pudo obtener todas las notificaciones del usuario");
    }
}


// Borrar una sola notificacion
const borrar_notificacion = async (req, res) => {
    try {
        const {id_notificacion} = req.params;
        
        await eliminar_notificacion({id_notificacion});

        return respuesta_exito(res, "Notificacion eliminada", 200);
    } 
    catch(error) {
        return respuesta_error_servidor(res, error, "No se pudo eliminar la notificacion");
    }
}


// Eliminar todas las notificaciones de un usuario
const borrar_todas_notificaciones = async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario;

        await eliminar_todas_notificacion({id_usuario});

        return respuesta_exito(res, "Notificaciones eliminadas correctamente", 200);
    }
    catch (error) {
        return respuesta_error_servidor(res, error, "No se pudo eliminar todas las notificaciones del usuario");    
    }
}



// ================== Exportar funciones ==================
module.exports = {
    obtener_notificacion_id,
    obtener_todas_notificaciones,
    borrar_notificacion,
    borrar_todas_notificaciones
}