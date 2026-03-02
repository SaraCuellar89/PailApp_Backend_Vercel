const conexion = require('../config/databse');

// Crear reaccion
const crear_reaccion = async (datos) => {
    const {id_usuario, id_publicacion} = datos;

    await conexion.execute('INSERT INTO reaccion (id_usuario, id_publicacion) VALUES(?, ?)', [id_usuario, id_publicacion]);
}


// Buscar reaccion
const buscar_reaccion = async (datos) => {
    const {id_usuario, id_publicacion} = datos;

    const [existe] = await conexion.execute('SELECT * FROM reaccion WHERE id_usuario = ?  AND id_publicacion = ?', [id_usuario, id_publicacion]);

    const [info_reaccion] = await conexion.execute(`
        SELECT 
            u.id_usuario AS id_autor_publicacion,
            u.nombre_usuario as nombre_autor_publicacion,

            p.id_publicacion as id_publicacion_reaccionada
        FROM reaccion r
            INNER JOIN publicacion p ON r.id_publicacion = p.id_publicacion
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
        WHERE r.id_usuario = ?  AND r.id_publicacion = ?
    `, [id_usuario, id_publicacion])

    const data = {
        existe, 
        info_reaccion: info_reaccion[0] || null
    }

    return data;
}


// Quitar reaccion
const  quitar_reaccion = async (datos) => {
    const {id_usuario, id_publicacion} = datos;

    const [resultado] = await conexion.execute('DELETE FROM reaccion WHERE id_usuario = ? AND id_publicacion = ?', [id_usuario, id_publicacion]);

    return resultado;
}



// ================== Exportar funciones ==================
module.exports = {
    crear_reaccion,
    buscar_reaccion,
    quitar_reaccion
}