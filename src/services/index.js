const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET;


// ================== Funciones para la seguridad de las contraseñas ==================
// Encriptado de contraseñas
const encriptar_contrasena = async (contrasena) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(contrasena, salt);
};

const comparar_contrasena = async (contrasena, hash) => {
  return await bcrypt.compare(contrasena, hash);
};


// ================== Funciones para crear tokens ==================
// Tokens de inicio de sesion
const generar_token = (usuario) => {
  return jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre_usuario,
      correo: usuario.correo,
      avatar: usuario.avatar
    },
    SECRET,
    { expiresIn: "7d" }
  );
};

const verificar_token = (token) => {
  return jwt.verify(token, SECRET);
};



// ================== Configurar Brevo API ==================
const enviar_email = async (destinatario, subject, htmlContent) => {
  console.log("Ejecutando enviar_email a:", destinatario);
  
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      to: [{ email: destinatario }],
      sender: { email: process.env.BREVO_FROM, name: 'PailApp' },
      subject: subject,
      htmlContent: htmlContent
    })
  });

  const data = await response.json();
  console.log("Respuesta Brevo:", JSON.stringify(data));
  return data;
};

// ================== Funciones para enviar correos ==================
const enviar_correo_registro = async (destinatario, nombre) => {
  return await enviar_email(destinatario, "Registro exitoso", `
    <h2>¡Hola ${nombre}! :)</h2>
    <p>Te has registrado correctamente. Ya puedes comenzar a explorar todos los platos deliciosos que tenemos para ti.</p>
    <div style="text-align:center;">
      <img src="http://st.depositphotos.com/1001911/1554/v/450/depositphotos_15540341-stock-illustration-thumb-up-emoticon.jpg" alt="Todo listo" width="120">
    </div>
    <br>
    <p style="font-size:12px; color:gray;">Este es un mensaje automático, por favor no respondas a este correo.</p>
  `);
};

const enviar_correo_vinculacion = async (destinatario, nombre) => {
  return await enviar_email(destinatario, "Vinculación con Google Exitosa", `
    <h2>¡Hola ${nombre}! :)</h2>
    <p>Ya puedes iniciar sesión en PailApp por medio de Google.</p>
    <div style="text-align:center;">
      <img src="http://st.depositphotos.com/1001911/1554/v/450/depositphotos_15540341-stock-illustration-thumb-up-emoticon.jpg" alt="Todo listo" width="120">
    </div>
    <br>
    <p style="font-size:12px; color:gray;">Este es un mensaje automático, por favor no respondas a este correo.</p>
  `);
};

const enviar_correo_recuperacion = async (destinatario, nombre, token) => {
  return await enviar_email(destinatario, "Recuperar contraseña", `
    <h2>¡Hola ${nombre}! :)</h2>
    <p>Tu token para restablecer la contraseña es (válido por 1 hora):</p>
    <div style="text-align:center; background:#f4f4f4; padding:12px; font-size:18px; font-weight:bold; letter-spacing:2px;">
      ${token}
    </div>
    <br>
    <p>Si no solicitaste esto, ignora este correo.</p>
    <p style="font-size:12px; color:gray;">Este es un mensaje automático, por favor no respondas a este correo.</p>
  `);
};

// ================== Exportar funciones ==================
module.exports = {
    encriptar_contrasena,
    comparar_contrasena,
    generar_token,
    verificar_token,
    enviar_correo_registro,
    enviar_correo_vinculacion,
    enviar_correo_recuperacion
}
