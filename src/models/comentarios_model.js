const conexion = require('../config/databse');


// Listar todos los comentarios de una publicacion
const crear_comentario = async(datos) => {
    const {contenido, id_usuario, id_publicacion} = datos;

    const [resultado] = await conexion.execute('INSERT INTO comentario (contenido, id_usuario, id_publicacion) VALUES(?, ?, ?)', [contenido, id_usuario, id_publicacion]);

    const id_comentario = resultado.insertId;

    const [comentario] = await conexion.execute(`SELECT * FROM comentario WHERE id_comentario = ?`, [id_comentario]);

    return comentario;
}


// Buscar comentario (obtener informacion para enviar notificiaciones)
const buscar_comentario = async (id_comentario) => {

    const [info_comentario] = await conexion.execute(`
        SELECT 
            u.id_usuario AS id_autor_publicacion,
            u.nombre_usuario as nombre_autor_publicacion,

            p.id_publicacion as id_publicacion_reaccionada
        FROM comentario c
            INNER JOIN publicacion p ON c.id_publicacion = p.id_publicacion
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
        WHERE c.id_comentario = ?
    `, [id_comentario])

    return info_comentario[0];
}


// Listar todos los comentarios de una publicacion
const listar_todos_comentarios = async (id_publicacion) => {
    const [resultados] = await conexion.execute('SELECT * FROM comentario WHERE id_publicacion = ?', [id_publicacion]);

    return resultados;
}


// Listar comentario por ID
const listar_comentario_id = async (id_comentario) => {
    const [info_comentario] = await conexion.execute('SELECT * from comentario WHERE id_comentario = ?', [id_comentario]);

    const [total_respuestas] = await conexion.execute(`
        SELECT 
            COUNT(*) as total_respuestas
        FROM respuesta_comentario
        WHERE id_comentario = ?`, [id_comentario]);

    const [info_respuestas] = await conexion.execute(`
        SELECT
            r.id_respuesta,
            r.contenido,
            r.fecha_creacion,
            r.id_comentario,
            r.id_usuario,
            u.nombre_usuario,
            u.avatar
        FROM respuesta_comentario r
        INNER JOIN usuario u
            ON r.id_usuario = u.id_usuario
        WHERE r.id_comentario = ?`, [id_comentario]);

    return {
        Comentario: info_comentario,
        total_respuestas,
        respuestas: info_respuestas
    };
}


// Actualizar comentario
const actualizar_comentario = async (datos) => {
    const {contenido, id_comentario} = datos;

    await conexion.execute('UPDATE comentario SET contenido = ? WHERE id_comentario = ?', [contenido, id_comentario]);
}


// Eliminar comentario
const eliminar_comentario = async (id_comentario) => {
    const [resultado] = await conexion.execute('DELETE FROM comentario WHERE id_comentario = ?', [id_comentario]);

    return resultado;
}


// ================== Exportar funciones ==================
module.exports = {
    listar_todos_comentarios,
    crear_comentario,
    buscar_comentario,
    listar_comentario_id,
    actualizar_comentario,
    eliminar_comentario
}