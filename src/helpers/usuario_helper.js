// Funcion para automatizar el guardado de la informacion del usuario en sesion

const construir_data_usuario = (usuario, token) => ({
    id: usuario.id_usuario,
    nombre: usuario.nombre_usuario,
    correo: usuario.correo,
    avatar: usuario.avatar,
    token
});


module.exports = {
    construir_data_usuario
}