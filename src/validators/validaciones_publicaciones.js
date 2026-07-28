const { respuesta_error } = require('../utils/responses');

const validar_subir_publicacion = (req, res, next) => {
    const { titulo, descripcion, ingredientes, preparacion, tipo_tiempo, dificultad } = req.body;
    const tiempo_preparacion = Number(req.body.tiempo_preparacion);

    if (!titulo || !descripcion || !ingredientes || !preparacion || !tipo_tiempo || !dificultad)
        return respuesta_error(res, "Todos los campos son obligatorios", 400);

    if (!Number.isFinite(tiempo_preparacion) || tiempo_preparacion <= 0)
        return respuesta_error(res, "El tiempo de preparación debe ser un número válido", 400);

    req.body.tiempo_preparacion = tiempo_preparacion;

    next();
};


module.exports = {
    validar_subir_publicacion, 
};