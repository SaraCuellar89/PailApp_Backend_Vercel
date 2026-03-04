const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

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


// ================== Funciones para enviar correos ==================
// Configurar transporte
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

// Función para enviar correo de registro
const enviar_correo_registro = async (destinatario, nombre) => {
  const mailOptions = {
    from: `"PailApp" <${process.env.BREVO_FROM}>`,
    to: destinatario,
    subject: "Registro exitoso",
    html: `
      <h2>¡Hola ${nombre}! :)</h2> 

      <p>Te has registro correctamente. Ya puedes comenzar a explorar todos los platos deliciosos que tenemos para ti.</p> 

      <div style="text-align:center;"> 
        <img src="http://st.depositphotos.com/1001911/1554/v/450/depositphotos_15540341-stock-illustration-thumb-up-emoticon.jpg" alt="Todo listo" width="120"> 
      </div> 
      
      <br> 
      
      <p style="font-size:12px; color:gray;"> Este es un mensaje automático, por favor no respondas a este correo. </p>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// Funcion para enviar correo de vinculacion con google
const enviar_correo_vinculacion = async (destinatario, nombre) => {
  const mailOptions = {
    from: `"PailApp" <${process.env.BREVO_FROM}>`,
    to: destinatario,
    subject: "Vinculación con Google Exitosa",
    html: `
      <h2>¡Hola ${nombre}! :)</h2> 

      <p>Ya puedes iniciar sesion en PailApp por medio de google.</p> 

      <div style="text-align:center;"> 
        <img src="http://st.depositphotos.com/1001911/1554/v/450/depositphotos_15540341-stock-illustration-thumb-up-emoticon.jpg" alt="Todo listo" width="120"> 
      </div> 
      
      <br> 
      
      <p style="font-size:12px; color:gray;"> Este es un mensaje automático, por favor no respondas a este correo. </p>
    `
  };

  return await transporter.sendMail(mailOptions);
};


// Funcion para enviar correo de recuperacion de contraseña
const enviar_correo_recuperacion = async (destinatario, nombre, token) => {
  console.log("Intentando enviar correo a:", destinatario);
  console.log("BREVO_USER:", process.env.BREVO_USER);
  console.log("BREVO_FROM:", process.env.BREVO_FROM);
  console.log("BREVO_PASS:", process.env.BREVO_PASS ? "existe" : "NO EXISTE");
  
  const mailOptions = {
    from: `"PailApp" <${process.env.BREVO_FROM}>`,
    to: destinatario,
    subject: "Recuperar contraseña",
    html: `
      <h2>¡Hola ${nombre}! :)</h2> 
      <p>Tu token para restablecer la contraseña es (válido por 1 hora):</p>
      <div style="text-align:center; background:#f4f4f4; padding:12px; font-size:18px; font-weight:bold; letter-spacing:2px;">
        ${token}
      </div>
      <br> 
      <p>Si no solicitaste esto, ignora este correo.</p>
      <p style="font-size:12px; color:gray;">Este es un mensaje automático, por favor no respondas a este correo.</p>
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente:", result.messageId);
    return result;
  } catch (error) {
    console.log("ERROR al enviar correo:", error.message);
    throw error;
  }
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
