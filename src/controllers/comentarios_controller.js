// ================== Importacion de funciones de error o exito ================== 
const {respuesta_exito,
    respuesta_error,
    respuesta_error_servidor} = require('../utils/responses');


// ================== Importacion de servicios ==================
const {notificar} = require('../services/notificaciones');


// ================== Importacion de modelos ==================
const {listar_todos_comentarios,
    crear_comentario,
    buscar_comentario,
    listar_comentario_id,
    actualizar_comentario,
    eliminar_comentario} = require('../models/comentarios_model');


// ================== Funciones del controlador ==================
// Subir comentario
const subir_comentario = async (req, res) => {
    try{
        const {contenido} = req.body;
        const {id_publicacion} = req.params;
        const id_usuario = req.usuario.id_usuario;

        const comentario = await crear_comentario({contenido, id_usuario, id_publicacion});

        const resultado = await buscar_comentario(comentario[0].id_comentario)

        const data = {
            id_autor_publicacion: resultado.id_autor_publicacion,
            nombre_autor_publicacion: resultado.nombre_autor_publicacion,
            id_publicacion_reaccionada: resultado.id_publicacion_reaccionada,
            usuario_emisor: id_usuario
        }

        await notificar({
            tipo: 'comentario',
            id_usuario: data.id_autor_publicacion, 
            id_emisor: id_usuario, 
            id_publicacion: data.id_publicacion_reaccionada
        })

        return respuesta_exito(res, "Comentario subido correctamente", 201, comentario);
    }
    catch(error){
        return respuesta_error_servidor(res, error, "No se pudo subir el comentario");
    }
}


// Obtener todos los comentarios
const obtener_todos_comentarios = async (req, res) => {
    try{
        const {id_publicacion} = req.params;

        const resultados = await listar_todos_comentarios(id_publicacion);

        if(resultados.length === 0){
            return respuesta_error(res, "No hay comentarios", 200);
        }

        return respuesta_exito(res, "Lista de comentarios", 200, resultados);
    }
    catch(error){
        return respuesta_error_servidor(res, error, "No se pudo obtener todos los comentarios");
    }
}


// Obtener comentario por ID
const obtener_comentario_id = async (req, res) => {
    try{
        const {id_comentario} = req.params;

        const resultado = await listar_comentario_id(id_comentario);

        if(resultado.length === 0){
            return respuesta_error(res, "No existe ese comentario", 404);
        }

        return respuesta_exito(res, "Informacion comentario", 200, resultado);
    }
    catch(error){
        return respuesta_error_servidor(res, error, "No se pudo obtener el comentario");
    }
}


// Editar Comentario
const editar_comentario = async (req, res) => {
    try{
        const {contenido} = req.body;
        const {id_comentario} = req.params;

        await actualizar_comentario({contenido, id_comentario});

        return respuesta_exito(res, "Comentario editado correctamente", 200);
    }
    catch(error){
        return respuesta_error_servidor(res, error, "No se pudo editar el comentario");
    }
}


// Borrar comentario
const borrar_comentario = async (req, res) => {
    try{
        const {id_comentario} = req.params;

        await eliminar_comentario(id_comentario);

        return respuesta_exito(res, "Comentario eliminado correctamente", 200);
    }
    catch(error){
        return respuesta_error_servidor(res, error, "No se pudo eliminar el comentario");
    }
}


// ================== Exportar funciones ==================
module.exports = {
    obtener_todos_comentarios,
    subir_comentario,
    obtener_comentario_id,
    editar_comentario,
    borrar_comentario
}