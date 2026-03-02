const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');


// ================== Importacion de Controladores ==================
const {filtrar_pupularidad,
    filtrar_antiguedad,
    filtrar_recientes} = require('../controllers/filtros_controller');


// ================== Rutas ==================
// Filtrar platos por poupularidad
router.get('/popularidad', filtrar_pupularidad);
// Filtrar platos por antiguedad
router.get('/antiguedad', filtrar_antiguedad);
// Filtrar platos por mas recientes
router.get('/recientes', filtrar_recientes);




// ================== Exportar funciones ==================
module.exports = router;