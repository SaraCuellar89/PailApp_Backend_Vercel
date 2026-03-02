// ================== Importacion de funciones de error o exito ================== 
const {respuesta_exito,
    respuesta_error,
    respuesta_error_servidor} = require('../utils/responses');


// ================== Importacion de modelos ==================
const {crear_respuesta,
    buscar_respuesta_id,
    actualizar_respuesta,
    eliminar_respuesta} = require('../models/respuestas_model');


// ================== Funciones del controlador ==================

// Contestar a un comentario
const contestar_comentario = async (req, res) => {
    try{
        const {contenido} = req.body;
        const id_usuario = req.usuario.id_usuario;
        const {id_comentario} = req.params;

        await crear_respuesta({contenido, id_usuario, id_comentario});

        return respuesta_exito(res, "Respuesta subida correctamente", 201);
    }
    catch(error){
        return respuesta_error_servidor(res, error, "No se pudo contestar el comentario");
    }
}


// Editar respuesta
const editar_respuesta = async (req, res) => {
    try{
        const {contenido} = req.body;
        const {id_respuesta} = req.params;

        await actualizar_respuesta({contenido, id_respuesta});

        return respuesta_exito(res, "Respuesta editada correctamente", 200);
    }
    catch(error){
        return respuesta_error_servidor(res, error, "No se pudo editar la respuesta");
    }
}


// Borrar Respuesta
const borrar_respuesta = async (req, res) => {
    try{
        const {id_respuesta} = req.params;

        await eliminar_respuesta(id_respuesta);

        return respuesta_exito(res, "Respuesta eliminada correctamente", 200);
    }
    catch(error){
        return respuesta_error_servidor(res, error, "No se pudo elimianr la respuesta");
    }
}


// ================== Exportar funciones ==================
module.exports = {
    contestar_comentario,
    editar_respuesta,
    borrar_respuesta
}