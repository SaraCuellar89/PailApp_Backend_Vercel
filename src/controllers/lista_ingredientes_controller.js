// ================== Importacion de funciones de error o exito ================== 
const {respuesta_exito,
    respuesta_error,
    respuesta_error_servidor} = require('../utils/responses');


// ================== Importacion de modelos ==================
const {insertar_ingredientes, 
    listar_todos_ingredientes,
    lista_ingrediente_id,
    editar_estado_ingrediente,
    eliminar_todos_ingredientes} = require('../models/lista_ingredientes_model');


// ================== Funciones del controlador ==================

// Agregar nuevo ingrediente a la lista
const agregar_ingredientes = async (req, res) => {
    try {
        const {ingredientes} = req.body;
        const {id_publicacion} = req.params;
        const id_usuario = req.usuario.id_usuario;

        await eliminar_todos_ingredientes({id_publicacion, id_usuario});
        
        await insertar_ingredientes({id_usuario, id_publicacion, ingredientes});

        return respuesta_exito(res, "Ingredientes agregados", 201);
    } catch (error) {
        return respuesta_error_servidor(res, error, "No se pudo agregar el ingrediente");
    }
}


// Obtener todos los ingredientes
const obtener_todos_ingredientes = async (req, res) => {
    try {
        const {id_publicacion} = req.params;
        const id_usuario = req.usuario.id_usuario;
        
        const ingredientes = await listar_todos_ingredientes({id_usuario, id_publicacion});

        return respuesta_exito(res, 'Lista de ingredientes', 200, ingredientes);
    } catch (error) {
        return respuesta_error_servidor(res, error, "No se pudo obtener los ingredientes");
    }
}


// Marcar checklist de un ingrediente
const marcar_obtenido = async (req, res) => {
    try {
        const {id_ingrediente} = req.params;

        const estado = await lista_ingrediente_id({id_ingrediente});

        if(estado[0].obtenido === 0){
            let marcar = 1;
            await editar_estado_ingrediente({id_ingrediente, obtenido: marcar});
            return respuesta_exito(res, "Ingrediente marcado", 200);
        }
        else{
            let desmarcar = 0;
            await editar_estado_ingrediente({id_ingrediente, obtenido: desmarcar});
            return respuesta_exito(res, "Ingrediente desmarcado", 200);
        }
    } catch (error) {
        return respuesta_error_servidor(res, error, "No se pudo marcar como obtenido");
    }
}


// ================== Exportar funciones ==================
module.exports = {
    agregar_ingredientes,
    obtener_todos_ingredientes,
    marcar_obtenido
}