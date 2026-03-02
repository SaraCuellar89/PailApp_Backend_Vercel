const conexion = require('../config/databse');


// Crear Respuesta
const crear_respuesta = async (datos) => {
    const {contenido, id_usuario, id_comentario} = datos;

    await conexion.execute('INSERT INTO respuesta_comentario (contenido, id_usuario, id_comentario) VALUES (?, ?, ?)', [contenido, id_usuario, id_comentario]);
}


// Buscar respuesta por ID
const buscar_respuesta_id = async (id_respuesta) => {
    const [resultado] = await conexion.execute('SELECT * FROM respuesta_comentario WHERE id_respuesta = ?', [id_respuesta]);

    return resultado;
}


// Editar respuesta
const actualizar_respuesta = async (datos) => {
    const {contenido, id_respuesta} = datos;

    await conexion.execute('UPDATE respuesta_comentario SET contenido = ? WHERE id_respuesta = ?', [contenido, id_respuesta]);
}


// Eliminar respuesta
const eliminar_respuesta = async (id_respuesta) => {

    const [resultado] = await conexion.execute('DELETE FROM respuesta_comentario WHERE id_respuesta = ?', [id_respuesta]);

    return resultado;    
}



// ================== Exportar funciones ==================
module.exports = {
    crear_respuesta,
    buscar_respuesta_id,
    actualizar_respuesta,
    eliminar_respuesta
}