const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');


// ================== Importacion de Controladores ==================
const {filtrar_pupularidad,
    filtrar_antiguedad,
    filtrar_recientes} = require('../controllers/filtros_controller');


// ================== Rutas ==================
// Filtrar platos por poupularidad
router.get('/populares', auth, filtrar_pupularidad);
// Filtrar platos por antiguedad
router.get('/antiguas', auth, filtrar_antiguedad);
// Filtrar platos por mas recientes
router.get('/recientes', auth, filtrar_recientes);




// ================== Exportar funciones ==================
module.exports = router;