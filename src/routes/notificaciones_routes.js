const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');


// ================== Importacion de Controladores ==================
const {obtener_notificacion_id,
    obtener_todas_notificaciones,
    borrar_notificacion,
    borrar_todas_notificaciones} = require('../controllers/notificaciones_controller');


// ================== Rutas ==================
// Obtener notificacion por ID
router.get('/una/:id_notificacion', obtener_notificacion_id);
// Obtener todas las notificaciones
router.get('/todas', auth, obtener_todas_notificaciones);
// Eliminar una sola notificacion
router.delete('/eliminar_una/:id_notificacion', borrar_notificacion);
// Eliminar todas las notificaciones
router.delete('/eliminar_todas', auth, borrar_todas_notificaciones);


// ================== Exportar funciones ==================
module.exports = router;