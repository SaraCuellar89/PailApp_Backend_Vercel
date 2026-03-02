const conexion = require('../config/databse');


// Crear una publicacion
const crear_publicacion = async (datos) => {
    const {titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, dificultad, id_usuario} = datos;

    await conexion.execute('INSERT INTO publicacion (titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, dificultad, id_usuario) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [titulo, descripcion, ingredientes, preparacion,  archivo, public_id, tiempo_preparacion, dificultad, id_usuario]);
}


// Listar todas las publicaciones
const listar_todas_publicaciones = async () => {
    const [resultados] = await conexion.execute('SELECT * FROM publicacion');

    return resultados;
}


// Obtener publicacion por ID
const listar_publicacion_id = async (id_publicacion) => {
    const [info_publicacion] = await conexion.execute(`
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
        -- ================== AUTOR DEL POST ==================
        u_post.id_usuario       AS autor_post_id,
        u_post.nombre_usuario  AS autor_post_nombre,
        u_post.avatar          AS autor_post_avatar
        FROM publicacion p
        -- Autor de la publicación
        INNER JOIN usuario u_post
        ON p.id_usuario = u_post.id_usuario
        WHERE p.id_publicacion = ?;
    `, [id_publicacion]);

    const [total_reacciones] = await conexion.execute(`SELECT COUNT(*) as total_reacciones FROM reaccion WHERE id_publicacion = ?`, [id_publicacion])

    const [info_reacciones] = await conexion.execute(`
        SELECT 
        u.id_usuario as reaccion_autor_id,
        u.nombre_usuario as reaccion_autor_nombre_usuario,
        u.correo as reaccion_autor_correo,
        u.avatar as reaccion_autor_avatar
        FROM reaccion r
        INNER JOIN usuario u
        ON r.id_usuario = u.id_usuario
        WHERE id_publicacion = ?
    `, [id_publicacion]);

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
        WHERE p.id_publicacion = ?;
    `, [id_publicacion]);

    const resultado = {
        publicacion: info_publicacion[0] || null,
        total_reacciones,
        informacion_reacciones: info_reacciones,
        total_comentarios,
        comentarios: info_comentarios
    };

    return resultado;
}


// Actualizar publicacion
const actualizar_publicacion = async (datos) => {
    const {titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, dificultad, id_publicacion} = datos;

    await conexion.execute('UPDATE publicacion SET titulo = ?, descripcion = ?, ingredientes = ?, preparacion = ?, archivo = ?, public_id = ?, tiempo_preparacion = ?, dificultad = ? WHERE id_publicacion = ?', [titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, dificultad, id_publicacion]); 
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
    actualizar_publicacion,
    eliminar_publicacion
}