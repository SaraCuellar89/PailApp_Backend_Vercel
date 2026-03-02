const conexion = require('../config/databse');


// Guardar token del dispositivo
const crear_token = async (datos) => {
    const {id_usuario, fcm_token} = datos;

    const [resultado] = await conexion.execute('INSERT INTO dispositivo (id_usuario, fcm_token) VALUES(?, ?) ON DUPLICATE KEY UPDATE fcm_token = ?, fecha_actualizacion = NOW()', [id_usuario, fcm_token, fcm_token]);

    return resultado;
}


// Buscar token
const obtener_token = async ({id_usuario}) => {
    const [resultado] = await conexion.execute('SELECT * FROM dispositivo WHERE id_usuario = ?', [id_usuario]);

    return resultado;
}



// ================== Exportar funciones ==================
module.exports = {
    crear_token,
    obtener_token
}