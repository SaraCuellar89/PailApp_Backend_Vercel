// ================== Importacion de funciones de error o exito ================== 
const {respuesta_exito,
    respuesta_error,
    respuesta_error_servidor} = require('../utils/responses');


// ================== Importacion de servicios ==================
const {notificar} = require('../services/notificaciones');


// ================== Importacion de modelos ==================
const {crear_reaccion,
    buscar_reaccion,
    quitar_reaccion} = require('../models/reacciones_model');


// ================== Funciones del controlador ==================
// Reaccionar a una publicacion
const reaccionar = async (req, res) => {
    try{
        const id_usuario = req.usuario.id_usuario;
        const {id_publicacion} = req.params;

        const buscar = await buscar_reaccion({id_usuario, id_publicacion});

        if(buscar.existe.length > 0){
            await quitar_reaccion({id_usuario, id_publicacion});

            return respuesta_exito(res, "Reaccion quitada correctamente", 200);
        }

        await crear_reaccion({id_usuario, id_publicacion});

        const resultado = await buscar_reaccion({id_usuario, id_publicacion});

        const data = {
            id_autor_publicacion: resultado.info_reaccion.id_autor_publicacion,
            nombre_autor_publicacion: resultado.info_reaccion.nombre_autor_publicacion,
            id_publicacion_reaccionada: resultado.info_reaccion.id_publicacion_reaccionada,
            usuario_emisor: id_usuario
        }

        await notificar({
            tipo: 'like',
            id_usuario: data.id_autor_publicacion, 
            id_emisor: id_usuario, 
            id_publicacion: data.id_publicacion_reaccionada
        });

        return respuesta_exito(res, "Reaccion subida correctamente", 201, data);
    }
    catch(error){
        return respuesta_error_servidor(res, error, "No se puedo reaccionar a la publicacion");
    }
}




// ================== Exportar funciones ==================
module.exports = {
    reaccionar
}