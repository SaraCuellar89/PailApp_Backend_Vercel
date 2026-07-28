const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const r2 = require('../config/config_cloudflare');

// ================== Importacion de funciones de error o exito ================== 
const {respuesta_exito,
    respuesta_error,
    respuesta_error_servidor} = require('../utils/responses');


// ================== Importacion de modelos ==================
const {crear_publicacion,
    listar_todas_publicaciones,
    listar_publicacion_id,
    listar_publicaciones_usuario,
    actualizar_publicacion,
    eliminar_publicacion} = require('../models/publicacion_model');


// ================== Funciones del controlador ==================

// Subir una publicacion
const subir_publicacion = async (req, res) => {
    try{
        const {titulo, descripcion, ingredientes, preparacion, tiempo_preparacion, tipo_tiempo, dificultad, fecha_creacion} = req.body;
        const id_usuario = req.usuario.id_usuario;

        // Convertir el array de ingredientes en JSON
        const ingredientes_string = typeof ingredientes === 'string' 
            ? ingredientes 
            : JSON.stringify(ingredientes);

        // Por si el usuario no sube ningun archivo, estos campos se guardan como nulos en la bbdd
        let archivo = null;
        let public_id = null;

        if (req.file) {

            // --- subir imagenes a cloudflare ---

            // Generar un nombre unico para el archivo
            const key = `archivos/${uuidv4()}-${req.file.originalname}`;
            
            await r2.send(new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: key,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            }));

            archivo = `${process.env.R2_PUBLIC_URL}/${key}`;
            public_id = key;
        }

        
        await crear_publicacion({titulo, descripcion, ingredientes: ingredientes_string, preparacion, archivo, public_id, tiempo_preparacion, tipo_tiempo, dificultad, fecha_creacion, id_usuario});

        const data = {titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, tipo_tiempo, dificultad, id_usuario}

        return respuesta_exito(res, 'Publicacion subida correctamente', 201, data);
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo subir la publicacion');
    }
}


// Listar todas las publicaciones
const obtener_todas_publicaciones = async (req, res) => {
    try{
        const id_usuario = req.usuario.id_usuario; 

        const resultados = await listar_todas_publicaciones(id_usuario);

        return respuesta_exito(res, 'Listado de publicaciones', 200, resultados);
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo obtener todas las publicaciones');
    }
}


// Listar una publicacion
const obtener_publicacion_id = async (req, res) => {
    try{
        const {id_publicacion} = req.params;
        const id_usuario = req.usuario.id_usuario; 

        const resultado = await listar_publicacion_id(id_usuario, id_publicacion);

        if (resultado.length === 0) {
            return respuesta_error(res, 'Esa publicacion no existe', 404);
        }

        return respuesta_exito(res, 'Listado de publicaciones', 200, resultado);
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo obtener la publicacion');
    }
}


// Obtener todas las publicaciones de un usuario
const obtnener_publicaciones_usuario = async (req, res) => {
    try{
        const id_usuario = req.usuario.id_usuario; 

        const resultados = await listar_publicaciones_usuario(id_usuario);

        return respuesta_exito(res, 'Listado de publicaciones', 200, resultados);
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo obtener todas las publicaciones');
    }
}


// Editar una publicacion
const editar_publicacion = async (req, res) => {
    try{
        const {titulo, descripcion, ingredientes, preparacion, tiempo_preparacion, tipo_tiempo, dificultad} = req.body;
        const {id_publicacion} = req.params;
        const id_usuario = req.usuario.id_usuario;

        // Convertir el array de ingredientes en JSON
        const ingredientes_string = JSON.stringify(ingredientes);

        const publicacion_actual = await listar_publicacion_id(id_usuario, id_publicacion);

        let archivo = publicacion_actual.publicacion?.publicacion_archivo ?? null;
        let public_id = publicacion_actual.publicacion?.publicacion_public_id ?? null;

        if (req.file) {

            const key = `archivos/${uuidv4()}-${req.file.originalname}`;

            await r2.send(new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: key,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            }));

            archivo = `${process.env.R2_PUBLIC_URL}/${key}`;
            public_id = key;

            // borrar imagen anterior
            if (publicacion_actual.publicacion.publicacion_public_id) {
                await r2.send(new DeleteObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME,
                    Key: publicacion_actual.publicacion.publicacion_public_id,
                }));
            }
        }

        await actualizar_publicacion({titulo, descripcion, ingredientes: ingredientes_string, preparacion, archivo, public_id, tiempo_preparacion, tipo_tiempo, dificultad, id_publicacion});

        const data = {titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, tipo_tiempo, dificultad, id_publicacion};

        return respuesta_exito(res, 'Publicacion editada correctamente', 200, data);
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo editar la publicacion');
    }
}


// Borrar una publicacion
const borrar_publicacion = async (req, res) => {
    try{
        const {id_publicacion} = req.params;
        const id_usuario = req.usuario.id_usuario;

        const resultado = await listar_publicacion_id(id_usuario, id_publicacion);

        // borrar imagen de r2
        if (resultado.publicacion.publicacion_public_id) {  
            await r2.send(new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: resultado.publicacion.publicacion_public_id, 
            }));
        }

        await eliminar_publicacion(id_publicacion);

        return respuesta_exito(res, 'Publicacion eliminada correctamente', 200);
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo eliminar la publicacion');
    }
}



// ================== Exportar funciones ==================
module.exports = {
    subir_publicacion,
    obtener_todas_publicaciones,
    obtener_publicacion_id,
    obtnener_publicaciones_usuario,
    editar_publicacion,
    borrar_publicacion
}