// ================== Importacion de servicios ==================
const {encriptar_contrasena, 
    comparar_contrasena,
    generar_token,
    verificar_token,
    enviar_correo_registro,
    enviar_correo_vinculacion,
    enviar_correo_recuperacion} = require('../services/index')


// ================== Importacion de Google ==================
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);


// ================== Importacion de funciones de error o exito ================== 
const {
    respuesta_exito,
    respuesta_error,
    respuesta_error_servidor} = require('../utils/responses')


// ================== Importacion de modelos de verificacion ==================
const {crear_token, 
    buscar_token, 
    eliminar_token} = require('../models/verificacion_model');


// ================== Importacion de modelos de usuario ==================
const {buscar_usuario_correo, 
    crear_usuario,
    buscar_usuario_google,
    crear_usuario_google,
    actualizar_usuario,
    obtener_usuario_id,
    eliminar_usuario,
    cambiar_tipo_cuenta,
    buscar_correo,
    actualizar_usuario_contrasena} = require('../models/usuarios_model');


// ================== Importacion de Helpers ==================
const {construir_data_usuario} = require('../helpers/usuario_helper');


// ================== Funciones del controlador ==================

// Registrar un usuario
const registrar_usuarios = async (req, res) => {
    try{
        const {nombre_usuario, correo, contrasena, confirmacion_contrasena, avatar} = req.body;

        const existencia = await buscar_usuario_correo(correo);

        if(existencia.length > 0){
            return respuesta_error(res, 'Este correo ya esta en uso', 400)
        }

        if (contrasena != confirmacion_contrasena){
            return respuesta_error(res, 'Las contraseñas no coinciden', 400)
        }

        const contrasena_encriptada = await encriptar_contrasena(contrasena)

        await crear_usuario({nombre_usuario, correo, contrasena:contrasena_encriptada, avatar});

        // enviar_correo_registro(correo, nombre_usuario).catch(console.error);

        return respuesta_exito(res, 'Usuario registrado correctamente', 201);
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo completar el registro')
    }
}


// Iniciar Sesion 
const iniciar_sesion = async(req, res) => {
    try{
        const {correo, contrasena} = req.body

        const busqueda = await buscar_usuario_correo(correo)

        if(busqueda.length === 0){
            return respuesta_error(res, 'Esa cuenta no esta registrada', 404)
        }

        const usuario = busqueda[0]

        if (usuario.proveedor === "google"){
            return respuesta_error(res, 'Inicia Sesion con google', 400)
        }

        const contrasena_correcta = await comparar_contrasena(contrasena, usuario.contrasena)

        if(!contrasena_correcta){
            return respuesta_error(res, 'Contraseña incorrecta', 401)
        }

        // Generar token
        const token = generar_token(usuario)

        // Funcion para automatizar la creacion de la data de un usuario
        const data = construir_data_usuario(usuario, token);

        return respuesta_exito(res, 'Inicio de sesion exitoso', 200, data)
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo iniciar sesion')
    }
}


// Iniciar Sesion Google
const iniciar_sesion_google = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return respuesta_error(res, 'Token no enviado', 400);
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload.email_verified) {
            return respuesta_error(res, 'Correo no verificado en Google', 403);
        }

        const {sub, email, name, picture} = payload;

        let nuevo_usuario = false;

        let usu = await buscar_usuario_google(sub);

        if (usu.length === 0) {
            nuevo_usuario = true;

            const existente = await buscar_usuario_correo(email);

            if (existente.length > 0) {
                // Vincular cuenta existente con Google
                await cambiar_tipo_cuenta({
                    google_id: sub,
                    id_usuario: existente[0].id_usuario
                });

                usu = await buscar_usuario_google(sub);

                const token_app = generar_token(usu[0]);

                const data = construir_data_usuario(usu[0], token_app);

                enviar_correo_vinculacion(email, name).catch(console.error);

                return respuesta_exito(res, 'Vinculación con Google exitosa', 200, data);
            } 
            else{
                // Crear usuario nuevo
                await crear_usuario_google({nombre_usuario: name, correo: email, contrasena: null, avatar: picture, google_id: sub});

                usu = await buscar_usuario_google(sub);

                const token_app = generar_token(usu[0]);

                const data = construir_data_usuario(usu[0], token_app);

                enviar_correo_registro(email, name).catch(console.error);

                return respuesta_exito(res, 'Usuario registro correctamente', 201, data);
            }
        }

        const usuario = usu[0];

        const token_app = generar_token(usuario);

        const data = construir_data_usuario(usuario, token_app);

        return respuesta_exito(res, 'Inicio con Google exitoso', 200, data);
    } 
    catch (error) {
        return respuesta_error_servidor(res, error, 'Error al autenticar con Google');
    }
};


// Obtener informacion de usuario en sesion
const informacion_usuario_token = async(req, res) => {
    return res.json({
        success: true,
        usuario: req.usuario
    })
}


// Editar cuenta del usuario
const editar_cuenta = async(req, res) => {
    try{
        const {nombre_usuario, correo, contrasena, confirmacion_contrasena, avatar} = req.body;
        const id_usuario = req.usuario.id_usuario;

        const existencia = await obtener_usuario_id(id_usuario);

        if(existencia.length === 0){
            return respuesta_error(res, 'Este usuario no existe', 400)
        }

        if (contrasena != confirmacion_contrasena){
            return respuesta_error(res, 'Las contraseñas no coinciden', 400)
        }

        const contrasena_encriptada = await encriptar_contrasena(contrasena)

        await actualizar_usuario({id_usuario, nombre_usuario, correo, contrasena:contrasena_encriptada, avatar});

        return respuesta_exito(res, 'Cuenta editada correctamente', 200)
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo editar la informacion de la cuenta')
    }
}


// Eliminar cuenta del usuario
const eliminar_cuenta = async(req, res) => {
    try{
        const id_usuario = req.usuario.id_usuario;

        const existencia = await obtener_usuario_id(id_usuario);

        if(existencia.length === 0){
            return respuesta_error(res, 'Este usuario no existe', 400)
        }

        await eliminar_usuario(id_usuario)

        return respuesta_exito(res, 'Cuenta eliminada correctamente', 200)
    }
    catch(error){
        return respuesta_error_servidor(res, error, 'No se pudo eliminar la cuenta')
    }
}


// Solicitar recuperacion de contraseña
const solicitar_recuperacion = async (req, res) => {
    try {
        const {correo} = req.body;

        const busqueda = await buscar_correo({correo});

        if(busqueda.length === 0){
            return respuesta_error(res, "Ese correo no esta registrado", 404);
        }

        const usuario = busqueda[0];

        if(usuario.contrasena == null){
            return respuesta_error(res, "Esta cuenta usa google, no requiere contraseña", 400)
        }

        const token = Math.floor(10000 + Math.random() * 90000).toString(); // codigo de 5 numeros
        const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        await crear_token({id_usuario: usuario.id_usuario, token, expira});

        enviar_correo_recuperacion(correo, usuario.nombre_usuario, token).catch(console.error);

        return respuesta_exito(res, "Correo de recuperacion enviado", 200);

    } catch (error) {
        return respuesta_error_servidor(res, error, "No se pudo enviar el correo de recuperacion");
    }
}


// Restablecer contraseña
const restablecer_contraseña = async (req, res) => {
    try {
        const {token} = req.params;
        const {contrasena, confirmacion_contrasena} = req.body;   

        if(contrasena !== confirmacion_contrasena){
            return respuesta_error(res, 'Las contraseñas no coinciden', 400);
        }

        const resultado = await buscar_token({token});

        if(resultado.length === 0){
            return respuesta_error(res, 'Token inválido o expirado', 400);
        }

        const {id_usuario} = resultado[0];

        const contrasena_encriptada = await encriptar_contrasena(contrasena);

        await actualizar_usuario_contrasena({id_usuario, contrasena: contrasena_encriptada});

        await eliminar_token({token});

        return respuesta_exito(res, 'Contraseña restablecida correctamente', 200);

    } catch (error) {
        return respuesta_error_servidor(res, error, "No se pudo restablecer la contraseña");
    }
}



// ================== Exportar funciones ==================
module.exports = {
    registrar_usuarios,
    iniciar_sesion,
    iniciar_sesion_google,
    informacion_usuario_token,
    editar_cuenta,
    eliminar_cuenta,
    solicitar_recuperacion,
    restablecer_contraseña
}