// ================== Importacion de funciones de error o exito ================== 
const {respuesta_exito,
    respuesta_error,
    respuesta_error_servidor} = require('../utils/responses');


// ================== Importacion de modelos ==================
const {listar_popularidad,
    listar_atiguedad,
    listar_recientes} = require('../models/filtros_model');


// ================== Funciones del controlador ==================

// Filtrar por popularidad
const filtrar_pupularidad = async (req, res) => {
    try {
        const platos = await listar_popularidad();

        if(platos.length == 0){
            return respuesta_error(res, "No hay platos", 404);
        }

        return respuesta_exito(res, "Lista de platos", 200, platos);

    } catch (error) {
        return respuesta_error_servidor(res, error, "No se pudo filtrar los platos por popularidad");
    }
}


// Filtrar por antiguedad
const filtrar_antiguedad = async (req, res) => {
    try {
        const platos = await listar_atiguedad();

        if(platos.length == 0){
            return respuesta_error(res, "No hay platos", 404);
        }

        return respuesta_exito(res, "Lista de platos", 200, platos);

    } catch (error) {
        return respuesta_error_servidor(res, error, "No se pudo filtrar los platos por antiguedad");
    }
}


// Filtrar por antiguedad
const filtrar_recientes = async (req, res) => {
    try {
        const platos = await listar_recientes();

        if(platos.length == 0){
            return respuesta_error(res, "No hay platos", 404);
        }

        return respuesta_exito(res, "Lista de platos", 200, platos);

    } catch (error) {
        return respuesta_error_servidor(res, error, "No se pudo filtrar los platos por mas recientes");
    }
}



// ================== Exportar funciones ==================
module.exports = {
    filtrar_pupularidad,
    filtrar_antiguedad,
    filtrar_recientes
}