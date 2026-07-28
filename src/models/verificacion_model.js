const conexion = require('../config/databse');


// Crear Token 
const crear_token = async (datos) => {
    const {id_usuario, token} = datos;

    await conexion.execute('DELETE FROM verificacion WHERE id_usuario = ?', [id_usuario]);

    const [resultado] = await conexion.execute('INSERT INTO verificacion (id_usuario, token, expira) VALUES(?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))', [id_usuario, token]);

    return resultado;
}


// Buscar token
const buscar_token = async ({token}) => {
    const [resultado] = await conexion.execute('SELECT * FROM verificacion WHERE token = ? AND expira > NOW()', [token]);

    return resultado;
}


// Eliminar token
const eliminar_token = async ({token}) => {
    const [resultado] = await conexion.execute('DELETE FROM verificacion WHERE token = ?', [token]);

    return resultado;
}



// ================== Exportar funciones ==================
module.exports = {
    crear_token, 
    buscar_token, 
    eliminar_token
}