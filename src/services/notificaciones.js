const admin = require('../config/config_firebase');


// ================== Importacion de modelos de notificaciones ==================
const {crear_noticiacion,
    buscar_notificacion,
    actualizar_notificacion} = require('../models/notificaciones_model');


// ================== Importacion de modelos de token FCM ==================    
const {obtener_token} = require('../models/token_fcm_model');



// Mensajes según tipo
const mensajes = {
  comentario: 'comentó tu publicación',
  like:       'le gusto tu publicación',
  guardado:   'guardó tu publicación'
};


// Funcion para guardar notificaciones en la bbdd dependiendo de si es like, comentario o guardado
const notificar = async (datos) => {
    const {tipo, id_usuario, id_emisor, id_publicacion} = datos;

    if(id_usuario == id_emisor) return;

    if(tipo !== "comentario"){
        const buscar = await buscar_notificacion({tipo, id_emisor, id_publicacion});

        if(buscar.length > 0){
            const id_notificacion = buscar[0].id_notificacion;
            await actualizar_notificacion({id_notificacion});
            return;
        }
    }

    await crear_noticiacion({tipo, id_usuario, id_emisor, id_publicacion});

    // Enviar push
    try {
        const token_data = await obtener_token({id_usuario});

        if(!token_data || token_data.length === 0) return;

        await admin.messaging().send({
            token: token_data[0].fcm_token,
            notification: {
                title: 'Nueva Notificación',
                body: `Alguien ${mensajes[tipo]}`
            },
            data: {
                tipo, 
                id_publicacion: String(id_publicacion)
            }
        })
    } catch (error) {
        console.error('Error enviando push:', error.message);
    }
}

module.exports = {notificar}