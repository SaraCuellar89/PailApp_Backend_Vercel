const conexion = require('../config/databse');


// Crear una publicacion
const crear_publicacion = async (datos) => {
    const {titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, tipo_tiempo, dificultad, fecha_creacion, id_usuario} = datos;

    await conexion.execute('INSERT INTO publicacion (titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, tipo_tiempo, dificultad, fecha_creacion, id_usuario) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [titulo, descripcion, ingredientes, preparacion,  archivo, public_id, tiempo_preparacion, tipo_tiempo, dificultad, fecha_creacion, id_usuario]);
}


// Listar todas las publicaciones
const listar_todas_publicaciones = async (id_usuario) => {
    const [resultados] = await conexion.execute(`
        SELECT
            p.*,
            COUNT(DISTINCT c.id_comentario) AS total_comentarios,
            COUNT(DISTINCT r.id_usuario) AS total_reacciones,
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
        LEFT JOIN comentario c 
            ON c.id_publicacion = p.id_publicacion
        LEFT JOIN reaccion r 
            ON r.id_publicacion = p.id_publicacion
        GROUP BY p.id_publicacion
        ORDER BY p.fecha_creacion DESC        
    `, [id_usuario, id_usuario]);

    return resultados;
}


// Obtener publicacion por ID
const listar_publicacion_id = async (id_usuario, id_publicacion) => {
    const [info_publicacion] = await conexion.execute(`
        SELECT 
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
        u_post.id_usuario       AS autor_post_id,
        u_post.nombre_usuario   AS autor_post_nombre,
        u_post.avatar           AS autor_post_avatar,
        EXISTS (
            SELECT 1 FROM reaccion r2 
            WHERE r2.id_publicacion = p.id_publicacion 
            AND r2.id_usuario = ?
        ) AS ya_reacciono,
        EXISTS (
            SELECT 1 FROM publicacion_guardada pg 
            WHERE pg.id_publicacion = p.id_publicacion 
            AND pg.id_usuario = ?
        ) AS ya_guardo
        FROM publicacion p
        INNER JOIN usuario u_post ON p.id_usuario = u_post.id_usuario
        WHERE p.id_publicacion = ?
    `, [id_usuario, id_usuario, id_publicacion]); 

    const [total_reacciones] = await conexion.execute(`SELECT COUNT(*) as total_reacciones FROM reaccion WHERE id_publicacion = ?`, [id_publicacion])

    const [total_comentarios] = await conexion.execute('SELECT COUNT(*) as total_comentarios FROM comentario WHERE id_publicacion = ?', [id_publicacion]);

    const [info_comentarios] = await conexion.execute(`
        SELECT 
        -- ================== COMENTARIO ==================
        c.id_comentario        AS comentario_id,
        c.contenido            AS comentario_contenido,
        c.fecha_creacion       AS comentario_fecha,
        c.id_usuario           AS comentario_autor_id,
        -- ================== AUTOR DEL COMENTARIO ==================
        u_coment.id_usuario     AS autor_comentario_id,
        u_coment.nombre_usuario AS autor_comentario_nombre,
        u_coment.avatar         AS autor_comentario_avatar
        FROM publicacion p
        -- Comentarios del post
        LEFT JOIN comentario c
        ON p.id_publicacion = c.id_publicacion
        -- Autor de cada comentario
        LEFT JOIN usuario u_coment
        ON c.id_usuario = u_coment.id_usuario
        WHERE p.id_publicacion = ?
        GROUP BY c.fecha_creacion DESC
    `, [id_publicacion]);

    const [info_respuestas] = await conexion.execute(`
        SELECT 
        r.id_respuesta          AS respuesta_id,
        r.contenido             AS respuesta_contenido,
        r.fecha_creacion        AS respuesta_fecha,
        r.id_comentario         AS respuesta_comentario_id,
        r.id_usuario            AS respuesta_autor_id,
        u_resp.id_usuario       AS autor_respuesta_id,
        u_resp.nombre_usuario   AS autor_respuesta_nombre,
        u_resp.avatar           AS autor_respuesta_avatar
        FROM respuesta_comentario r
        INNER JOIN comentario c ON r.id_comentario = c.id_comentario
        INNER JOIN usuario u_resp ON r.id_usuario = u_resp.id_usuario
        WHERE c.id_publicacion = ?
        ORDER BY r.fecha_creacion ASC
    `, [id_publicacion])

    const respuestas_por_comentario = info_respuestas.reduce((acc, respuesta) => {
        const id = respuesta.respuesta_comentario_id;
        if (!acc[id]) acc[id] = [];
        acc[id].push(respuesta);
        return acc;
    }, {});

    const comentarios_con_respuestas = info_comentarios.map(comentario => ({
        ...comentario,
        respuestas: respuestas_por_comentario[comentario.comentario_id] || []
    }));

    const resultado = {
        publicacion: info_publicacion[0] || null,
        total_reacciones: total_reacciones[0].total_reacciones,
        total_comentarios: total_comentarios[0].total_comentarios,
        comentarios: comentarios_con_respuestas
    };
    
    return resultado;
}


// Listar todas las publicaciones de un usuario
const listar_publicaciones_usuario = async (id_usuario) => {
    const [resultados] = await conexion.execute(`
        SELECT
            p.*,
            COUNT(DISTINCT c.id_comentario) AS total_comentarios,
            COUNT(DISTINCT r.id_usuario) AS total_reacciones,
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
        LEFT JOIN comentario c 
            ON c.id_publicacion = p.id_publicacion
        LEFT JOIN reaccion r 
            ON r.id_publicacion = p.id_publicacion
        WHERE p.id_usuario = ?
        GROUP BY p.id_publicacion
        ORDER BY p.fecha_creacion DESC    
    `, [id_usuario, id_usuario, id_usuario]);

    return resultados;
}


// Actualizar publicacion
const actualizar_publicacion = async (datos) => {
    const {titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, tipo_tiempo, dificultad, id_publicacion} = datos;

    await conexion.execute('UPDATE publicacion SET titulo = ?, descripcion = ?, ingredientes = ?, preparacion = ?, archivo = ?, public_id = ?, tiempo_preparacion = ?, tipo_tiempo = ?, dificultad = ? WHERE id_publicacion = ?', [titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, tipo_tiempo, dificultad, id_publicacion]); 
}


// Eliminar publicacion
const eliminar_publicacion = async (id_publicacion) => {
    const [resultado] = await conexion.execute('DELETE FROM publicacion WHERE id_publicacion = ?', [id_publicacion]);

    return resultado;
}



// ================== Exportar funciones ==================
module.exports = {
    crear_publicacion,
    listar_todas_publicaciones,
    listar_publicacion_id,
    listar_publicaciones_usuario,
    actualizar_publicacion,
    eliminar_publicacion
}