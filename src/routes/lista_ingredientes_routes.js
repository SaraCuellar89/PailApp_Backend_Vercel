const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');
const upload = require('../middlewares/upload');


// ================== Importacion de Controladores ==================
const {
    agregar_ingredientes,
    obtener_todos_ingredientes,
    marcar_obtenido,} = require('../controllers/lista_ingredientes_controller');


// ================== Rutas ==================

// Agregar un ingrediente
router.post('/agregar/:id_publicacion', auth, agregar_ingredientes);
// Otbener todos los ingredientes de una publicacion
router.get('/todos/:id_publicacion', auth, obtener_todos_ingredientes);
// Marcar checklist del ingrediente
router.post('/marcar/:id_ingrediente', auth, marcar_obtenido);



// ================== Exportar funciones ==================
module.exports = router;