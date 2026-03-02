const conexion = require('../config/databse');


// Filtrar por popularidad
const listar_popularidad = async () => {
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
        p.dificultad            AS publicacion_dificultad,
        p.fecha_creacion        AS publicacion_fecha,
        p.id_usuario            AS publicacion_autor_id,
        -- ================== Reacciones ==================
        COALESCE(r.total_reacciones, 0)  AS total_reacciones,
        -- ================== Comentarios ==================
        COALESCE(c.total_comentarios, 0) AS total_comentarios
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
        ORDER BY total_reacciones DESC;
    `);

    return resultado;
}


// Filtrar por antiguedad
const listar_atiguedad = async () => {
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
        p.dificultad            AS publicacion_dificultad,
        p.fecha_creacion        AS publicacion_fecha,
        p.id_usuario            AS publicacion_autor_id,
        -- ================== Reacciones ==================
        COALESCE(r.total_reacciones, 0)  AS total_reacciones,
        -- ================== Comentarios ==================
        COALESCE(c.total_comentarios, 0) AS total_comentarios
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
    `);

    return resultado;
}


// Filtrar por antiguedad
const listar_recientes = async () => {
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
        p.dificultad            AS publicacion_dificultad,
        p.fecha_creacion        AS publicacion_fecha,
        p.id_usuario            AS publicacion_autor_id,
        -- ================== Reacciones ==================
        COALESCE(r.total_reacciones, 0)  AS total_reacciones,
        -- ================== Comentarios ==================
        COALESCE(c.total_comentarios, 0) AS total_comentarios
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
        ORDER BY total_reacciones ASC;   
    `);

    return resultado;
}


// ================== Exportar funciones ==================
module.exports = {
    listar_popularidad,
    listar_atiguedad,
    listar_recientes
}