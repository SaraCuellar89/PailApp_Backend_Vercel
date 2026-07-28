const conexion = require('../config/databse');


// Crear plato guardado
const crear_plato_guardado = async (datos) => {
    const {id_usuario, id_publicacion} = datos;
    
    await conexion.execute('INSERT INTO publicacion_guardada (id_usuario, id_publicacion) VALUES (?, ?)', [id_usuario, id_publicacion]);
}


// Buscar plato guardado
const buscar_plato_guardado = async (datos) => {
    const {id_usuario, id_publicacion} = datos;
    
    const [existe] = await conexion.execute('SELECT * FROM publicacion_guardada WHERE id_usuario = ? AND id_publicacion = ?', [id_usuario, id_publicacion]);

    const [info_plato_guardado] = await conexion.execute(`
        SELECT 
            u.id_usuario AS id_autor_publicacion,
            u.nombre_usuario AS nombre_autor_publicacion,

            p.id_publicacion AS id_publicacion_reaccionada,
            p.ingredientes AS ingredientes_publicacion
        FROM publicacion_guardada pg
            INNER JOIN publicacion p ON pg.id_publicacion = p.id_publicacion
            INNER JOIN usuario u ON p.id_usuario = u.id_usuario
        WHERE pg.id_usuario = ?  AND pg.id_publicacion = ?
    `, [id_usuario, id_publicacion])

    const data = {
        existe, 
        info_plato_guardado: info_plato_guardado[0] || null
    }

    return data;
}


// Elimianar plato guardado
const eliminar_plato_guardado = async (datos) => {
    const {id_usuario, id_publicacion} = datos;
    
    const [resultado] = await conexion.execute('DELETE FROM publicacion_guardada WHERE id_usuario = ? AND id_publicacion = ?', [id_usuario, id_publicacion]);

    return resultado;
}

// Listar platos guardados
const listar_platos_guardados = async (id_usuario) => {
    const [platos_guardados] = await conexion.execute(`
        SELECT
            p.*,
            COUNT(DISTINCT c.id_comentario)  AS total_comentarios,
            COUNT(DISTINCT r.id_usuario)     AS total_reacciones,
            EXISTS (
                SELECT 1 FROM reaccion r2 
                WHERE r2.id_publicacion = p.id_publicacion 
                AND r2.id_usuario = ?
            ) AS usuario_ya_reacciono,
            EXISTS (
                SELECT 1 FROM publicacion_guardada pg 
                WHERE pg.id_publicacion = p.id_publicacion 
                AND pg.id_usuario = ?
            ) AS usuario_ya_guardo
        FROM publicacion_guardada g
        INNER JOIN publicacion p
            ON g.id_publicacion = p.id_publicacion
        INNER JOIN usuario u_post
            ON p.id_usuario = u_post.id_usuario
        LEFT JOIN comentario c 
            ON c.id_publicacion = p.id_publicacion
        LEFT JOIN reaccion r 
            ON r.id_publicacion = p.id_publicacion
        WHERE g.id_usuario = ?
        GROUP BY p.id_publicacion
        ORDER BY p.fecha_creacion DESC
    `, [id_usuario, id_usuario, id_usuario]);

    const datos = {
        platos_guardados
    }

    return datos;
}


// ================== Exportar funciones ==================
module.exports = {
    crear_plato_guardado,
    buscar_plato_guardado,
    eliminar_plato_guardado,
    listar_platos_guardados
}