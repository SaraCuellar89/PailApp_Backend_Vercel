const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');


// ================== Importacion de Controladores ==================
const {reaccionar} = require('../controllers/reacciones_controlller');


// ================== Rutas ==================
router.post('/reaccionar/:id_publicacion', auth, reaccionar); 


// ================== Exportar funciones ==================
module.exports = router;