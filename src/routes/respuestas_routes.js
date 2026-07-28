const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');


// ================== Importacion de Controladores ==================
const {contestar_comentario,
    editar_respuesta,
    borrar_respuesta} = require('../controllers/respuestas_controller');


// ================== Rutas ==================
// Responder a un comentario
router.post('/contestar/:id_comentario', auth, contestar_comentario);
// Editar respuesta
router.put('/editar/:id_respuesta', auth, editar_respuesta);
// Eliminar respuesta
router.delete('/eliminar/:id_respuesta', auth, borrar_respuesta);



// ================== Exportar funciones ==================
module.exports = router;