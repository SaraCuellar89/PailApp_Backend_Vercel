// ================== Importacion de funciones de error o exito ================== 
const {respuesta_exito,
    respuesta_error,
    respuesta_error_servidor} = require('../utils/responses');


// ================== Importacion de servicios ==================
const {notificar} = require('../services/notificaciones');


// ================== Importacion de modelos ==================
const {crear_plato_guardado,
    buscar_plato_guardado,
    eliminar_plato_guardado,
    listar_platos_guardados} = require('../models/guardados_model');

const {insertar_ingredientes,
    eliminar_todos_ingredientes} = require('../models/lista_ingredientes_model');


// ================== Funciones del controlador ==================

// Guardar plato
const guardar_plato = async (req, res) => {
    try{
        const id_usuario = req.usuario.id_usuario;
        const {id_publicacion} = req.params;

        const buscar = await buscar_plato_guardado({id_usuario, id_publicacion});

        if(buscar.existe.length > 0){
            await eliminar_plato_guardado({id_usuario, id_publicacion});

            // Eliminar lista de ingredientes
            await eliminar_todos_ingredientes({id_publicacion, id_usuario});
            
            return respuesta_exito(res, "Plato Guardado eliminado correctamente", 200);
        }

        await crear_plato_guardado({id_usuario, id_publicacion});

        const resultado = await buscar_plato_guardado({id_usuario, id_publicacion});

        const data = {
            id_autor_publicacion: resultado.info_plato_guardado.id_autor_publicacion,
            nombre_autor_publicacion: resultado.info_plato_guardado.nombre_autor_publicacion,
            id_publicacion_reaccionada: resultado.info_plato_guardado.id_publicacion_reaccionada,
            usuario_emisor: id_usuario
        }

        // Insertar ingredientes en una lista personalizable
        const ingredientes_raw = resultado.info_plato_guardado.ingredientes_publicacion;

        const ingredientes = typeof ingredientes_raw === 'string' && ingredientes_raw.startsWith('"')
            ? JSON.parse(JSON.parse(ingredientes_raw))
            : JSON.parse(ingredientes_raw);

        const ingredientes_formateados = ingredientes.map(nombre => ({ nombre, obtenido: 0 }));

        await insertar_ingredientes({id_usuario, id_publicacion, ingredientes: ingredientes_formateados});

        // Llamar al servicio de noticiacion
        await notificar({
            tipo: 'guardado',
            id_usuario: data.id_autor_publicacion, 
            id_emisor: id_usuario, 
            id_publicacion: data.id_publicacion_reaccionada
        });

        return respuesta_exito(res, "Plato Guardado correctamente", 200);
    }
    catch(error){
        return respuesta_error_servidor(res, error, "No se pudo guardar el plato");
    }
}


// Obtener todos los platos guardados de un usuario
const obtener_platos_guardados = async (req, res) => {
    try{
        const id_usuario = req.usuario.id_usuario;

        const existencia = await listar_platos_guardados(id_usuario);

        if(existencia.length === 0){
            return respuesta_error(res, "No hay platos guardados", 404);
        }

        return respuesta_exito(res, "Lista de platos guardados", 200, existencia);

    }
    catch(error){
        return respuesta_error_servidor(res, error, "No se pudo listar los platos guardados")
    }
} 


// ================== Exportar funciones ==================
module.exports = {
    guardar_plato,
    obtener_platos_guardados
}