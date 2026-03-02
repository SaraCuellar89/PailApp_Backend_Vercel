const conexion = require('../config/databse')


// Buscar la existencia de un usuario por medio de su correo
const buscar_usuario_correo = async (correo) => {
    const [resultado] = await conexion.execute('SELECT * FROM usuario WHERE correo = ?', [correo]);

    return resultado;
}


// Crear un usuario nuevo
const crear_usuario = async (datos) => {
    const {nombre_usuario, correo, contrasena, avatar} = datos;

    await conexion.execute('INSERT INTO usuario (nombre_usuario, correo, contrasena, avatar) VALUES (?, ?, ?, ?)', [nombre_usuario, correo, contrasena, avatar]);
}


// Buscar usuario con inicio de sesion con google
const buscar_usuario_google = async (google_id) => {
    const [resultado] = await conexion.execute("SELECT * FROM usuario WHERE google_id = ?", [google_id]);

    return resultado;
};


// Crear usuario con google
const crear_usuario_google = async (datos) => {
  const {nombre_usuario, correo, contrasena, avatar, google_id} = datos;

  const avatar_db = "https://pbs.twimg.com/profile_images/1226219505208221696/fEEzgwG3_400x400.jpg";

  await conexion.execute('INSERT INTO usuario (nombre_usuario, correo, contrasena, avatar, proveedor, google_id) VALUES(?, ?, ?, ?, "google", ?)', [nombre_usuario, correo, contrasena, avatar_db, google_id]);
};


// Pasar de cuenta local a cuenta con google
const cambiar_tipo_cuenta = async (datos) => {
    const {google_id, id_usuario} = datos;

    await conexion.execute("UPDATE usuario SET google_id = ?, proveedor = 'google' WHERE id_usuario = ?", [google_id, id_usuario]);
}


// Buscar usuario por CORREO
const buscar_correo = async ({correo}) => {
    const [resultado] = await conexion.execute('SELECT * FROM usuario WHERE correo = ?', [correo]);

    return resultado;
}


// Obtener usuario por ID
const obtener_usuario_id = async (id_usuario) => {
    const [resultado] = await conexion.execute('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario]);

    return resultado;
} 


// Actualizar contraseña del usuario
const actualizar_usuario_contrasena = async (datos) => {
    const {id_usuario, contrasena} = datos;

    await conexion.execute('UPDATE usuario SET contrasena = ? WHERE id_usuario = ?', [contrasena, id_usuario]);
}


// Editar usuario
const actualizar_usuario = async (datos) => {
    const {id_usuario, nombre_usuario, correo, contrasena, avatar} = datos;

    await conexion.execute('UPDATE usuario SET nombre_usuario = ?, correo = ?, contrasena = ?, avatar = ? WHERE id_usuario = ?', [nombre_usuario, correo, contrasena, avatar, id_usuario]);
}



// Eliminar usuario
const eliminar_usuario = async (id_usuario) => {
    const [resultado] = await conexion.execute('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario]);

    return resultado;
}



// ================== Exportar funciones ==================
module.exports = {
    buscar_usuario_correo,
    crear_usuario,
    buscar_usuario_google,
    crear_usuario_google,
    obtener_usuario_id,
    actualizar_usuario,
    eliminar_usuario,
    cambiar_tipo_cuenta,
    buscar_correo,
    actualizar_usuario_contrasena
}