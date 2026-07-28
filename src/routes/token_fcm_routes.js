const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');


// ================== Importacion de Controladores ==================
const {guardar_token,
    eliminar_token} = require('../controllers/token_fcm_controller');


// ================== Rutas ==================
// Guardar token FCM para enviar notificaciones con Firebase
router.post('/guardar', auth, guardar_token);
// Eliminar token FCM
router.delete('/eliminar', auth, eliminar_token);



// ================== Exportar funciones ==================
module.exports = router;