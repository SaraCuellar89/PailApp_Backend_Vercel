const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');


// ================== Importacion de Controladores ==================
const {guardar_token} = require('../controllers/token_fcm_controller');


// ================== Rutas ==================
// Guardar token FCM para enviar notificaciones con Firebase
router.post('/guardar', auth, guardar_token);



// ================== Exportar funciones ==================
module.exports = router;