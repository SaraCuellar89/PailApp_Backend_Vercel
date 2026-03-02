const cloudinary = require('../config/config_cloudinary');
const streamifier = require('streamifier');

// ================== Importacion de funciones de error o exito ================== 
const {respuesta_exito,
    respuesta_error,
    respuesta_error_servidor} = require('../utils/responses');


// ================== Importacion de modelos ==================
const {crear_publicacion,
    listar_todas_publicaciones,
    listar_publicacion_id,
    actualizar_publicacion,
    eliminar_publicacion} = require('../models/publicacion_model');


// ================== Funciones del controlador ==================

// Subir una publicacion
const subir_publicacion = async (req, res) => {
    try{
        const {titulo, descripcion, ingredientes, preparacion, tiempo_preparacion, dificultad} = req.body;
        const id_usuario = req.usuario.id_usuario;

        // Por si el usuario no sube ningun archivo, estos campos se guardan como nulos en la bbdd
        let archivo = null;
        let public_id = null;

        if (req.file) {

            // Funcion para cargar una el arhivo a cloudinary, transformarlo si es necesario y generar la url y el public id 
            const resultado = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'archivos',
                        resource_type: 'auto',
                        transformation: [
                            { width: 1080, crop: "limit" },
                            { quality: "auto" }
                        ]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });

            archivo = resultado.secure_url;
            public_id = resultado.public_id;
        }

        
        await crear_publicacion({titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, dificultad, id_usuario});

        const data = {titulo, descripcion, ingredientes, preparacion,  archivo, public_id, tiempo_preparacion, dificultad, id_usuario}

        return respuesta_exito(res, 'Publicacion subida correctamente', 201, data);
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo subir la publicacion');
    }
}


// Listar todas las publicaciones
const obtener_todas_publicaciones = async (req, res) => {
    try{
        const resultados = await listar_todas_publicaciones();

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

        const resultado = await listar_publicacion_id(id_publicacion);

        console.log(resultado.publicacion.publicacion_public_id)

        if (resultado.length === 0) {
            return respuesta_error(res, 'Esa publicacion no existe', 404);
        }

        return respuesta_exito(res, 'Listado de publicaciones', 200, resultado);
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo obtener la publicacion');
    }
}


// Editar una publicacion
const editar_publicacion = async (req, res) => {
    try{
        const {titulo, descripcion, ingredientes, preparacion, tiempo_preparacion, dificultad} = req.body;
        const {id_publicacion} = req.params;

        const publicacion_actual = await listar_publicacion_id(id_publicacion);

        let archivo = publicacion_actual.publicacion?.publicacion_archivo ?? null;
        let public_id = publicacion_actual.publicacion?.publicacion_public_id ?? null;

        if (req.file) {

            const resultado = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'archivos',
                        resource_type: 'auto',
                        transformation: [
                            { width: 1080, crop: "limit" },
                            { quality: "auto" }
                        ]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });

            archivo = resultado.secure_url;
            public_id = resultado.public_id;

            // borrar imagen anterior
            if (publicacion_actual.publicacion.publicacion_public_id) {
                await cloudinary.uploader.destroy(
                    publicacion_actual.publicacion.publicacion_public_id,
                    { resource_type: "image" }
                );
            }
        }

        await actualizar_publicacion({titulo, descripcion, ingredientes, preparacion, archivo, public_id, tiempo_preparacion, dificultad, id_publicacion});

        return respuesta_exito(res, 'Publicacion editada correctamente', 200);
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo editar la publicacion');
    }
}


// Borrar una publicacion
const borrar_publicacion = async (req, res) => {
    try{
        const {id_publicacion} = req.params;

        const resultado = await listar_publicacion_id(id_publicacion);

        // borrar imagen de cloudinary
        if(resultado.publicacion.publicacion_public_id){
            const resultadoCloudinary = await cloudinary.uploader.destroy(resultado.publicacion.publicacion_public_id, {
                resource_type: "image"
            });
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
    editar_publicacion,
    borrar_publicacion
}