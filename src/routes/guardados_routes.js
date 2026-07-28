const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');


// ================== Importacion de Controladores ==================
const {guardar_plato,
    obtener_platos_guardados} = require('../controllers/guardados_controller');


// ================== Rutas ==================
// Guardar o Elimnar de guardados (forma rapida)
router.post('/guardar/:id_publicacion', auth, guardar_plato);
// Obtener todos los platos guardados de un usuario
router.get('/listar', auth, obtener_platos_guardados);



// ================== Exportar funciones ==================
module.exports = router;