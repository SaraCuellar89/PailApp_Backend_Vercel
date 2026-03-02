// Configuracion de Google Cloud para poder acceder a la aplicacion con un correo de google

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.CLIENT_ID);

module.exports = client;