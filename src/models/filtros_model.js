const conexion = require('../config/databse');


// Filtrar por popularidad
const listar_popularidad = async (id_usuario) => {
    const [resultado] = await conexion.execute(`
        SELECT 
            -- ================== Publicacion ==================
            p.id_publicacion        AS publicacion_id,
            p.titulo                AS publicacion_titulo,
            p.descripcion           AS publicacion_descripcion,
            p.ingredientes          AS publicacion_ingredientes,
            p.preparacion           AS publicacion_preparacion,
            p.archivo               AS publicacion_archivo,
            p.public_id             AS publicacion_public_id,
            p.tiempo_preparacion    AS publicacion_tiempo_preparacion,
            p.tipo_tiempo           AS publicacion_tipo_tiempo,
            p.dificultad            AS publicacion_dificultad,
            p.fecha_creacion        AS publicacion_fecha,
            p.id_usuario            AS publicacion_autor_id,
            -- ================== Reacciones ==================
            COALESCE(r.total_reacciones, 0) AS total_reacciones,
            -- ================== Comentarios ==================
            COALESCE(c.total_comentarios, 0) AS total_comentarios,
            -- ================== Usuario ==================
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
        FROM publicacion p
        LEFT JOIN (
            SELECT id_publicacion, COUNT(*) AS total_reacciones
            FROM reaccion
            GROUP BY id_publicacion
        ) r ON p.id_publicacion = r.id_publicacion
        LEFT JOIN (
            SELECT id_publicacion, COUNT(*) AS total_comentarios
            FROM comentario
            GROUP BY id_publicacion
        ) c ON p.id_publicacion = c.id_publicacion
        GROUP BY p.id_publicacion
        ORDER BY total_reacciones DESC;
    `, [id_usuario, id_usuario]);

    return resultado;
}


// Filtrar por antiguedad
const listar_atiguedad = async (id_usuario) => {
    const [resultado] = await conexion.execute(`
        SELECT 
        -- ================== PUBLICACION ==================
        p.id_publicacion        AS publicacion_id,
        p.titulo                AS publicacion_titulo,
        p.descripcion           AS publicacion_descripcion,
        p.ingredientes          AS publicacion_ingredientes,
        p.preparacion           AS publicacion_preparacion,
        p.archivo               AS publicacion_archivo,
        p.public_id             AS publicacion_public_id,
        p.tiempo_preparacion    AS publicacion_tiempo_preparacion,
        p.tipo_tiempo           AS publicacion_tipo_tiempo,
        p.dificultad            AS publicacion_dificultad,
        p.fecha_creacion        AS publicacion_fecha,
        p.id_usuario            AS publicacion_autor_id,
        -- ================== Reacciones ==================
        COALESCE(r.total_reacciones, 0)  AS total_reacciones,
        -- ================== Comentarios ==================
        COALESCE(c.total_comentarios, 0) AS total_comentarios,
        -- ================== Usuario ==================
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
        FROM publicacion p
        LEFT JOIN (
            SELECT id_publicacion, COUNT(*) AS total_reacciones
            FROM reaccion
            GROUP BY id_publicacion
        ) r ON p.id_publicacion = r.id_publicacion
        LEFT JOIN (
            SELECT id_publicacion, COUNT(*) AS total_comentarios
            FROM comentario
            GROUP BY id_publicacion
        ) c ON p.id_publicacion = c.id_publicacion
        GROUP BY p.id_publicacion
        ORDER BY p.fecha_creacion ASC  
    `, [id_usuario, id_usuario]);

    return resultado;
}


// Filtrar por antiguedad
const listar_recientes = async (id_usuario) => {
    const [resultado] = await conexion.execute(`
        SELECT 
        -- ================== PUBLICACION ==================
        p.id_publicacion        AS publicacion_id,
        p.titulo                AS publicacion_titulo,
        p.descripcion           AS publicacion_descripcion,
        p.ingredientes          AS publicacion_ingredientes,
        p.preparacion           AS publicacion_preparacion,
        p.archivo               AS publicacion_archivo,
        p.public_id             AS publicacion_public_id,
        p.tiempo_preparacion    AS publicacion_tiempo_preparacion,
        p.tipo_tiempo           AS publicacion_tipo_tiempo,
        p.dificultad            AS publicacion_dificultad,
        p.fecha_creacion        AS publicacion_fecha,
        p.id_usuario            AS publicacion_autor_id,
        -- ================== Reacciones ==================
        COALESCE(r.total_reacciones, 0)  AS total_reacciones,
        -- ================== Comentarios ==================
        COALESCE(c.total_comentarios, 0) AS total_comentarios,
        -- ================== Usuario ==================
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
        FROM publicacion p
        LEFT JOIN (
            SELECT id_publicacion, COUNT(*) AS total_reacciones
            FROM reaccion
            GROUP BY id_publicacion
        ) r ON p.id_publicacion = r.id_publicacion
        LEFT JOIN (
            SELECT id_publicacion, COUNT(*) AS total_comentarios
            FROM comentario
            GROUP BY id_publicacion
        ) c ON p.id_publicacion = c.id_publicacion
        GROUP BY p.id_publicacion
        ORDER BY p.fecha_creacion DESC
    `, [id_usuario, id_usuario]);

    return resultado;
}


// ================== Exportar funciones ==================
module.exports = {
    listar_popularidad,
    listar_atiguedad,
    listar_recientes
}