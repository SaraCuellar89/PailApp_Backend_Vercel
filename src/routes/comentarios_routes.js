const express = require('express');
const router =express.Router();
const { auth } = require('../middlewares');


// ================== Importacion de Controladores ==================
const {obtener_todos_comentarios,
        subir_comentario,
        obtener_comentario_id,
        editar_comentario,
        borrar_comentario} = require('../controllers/comentarios_controller');


// ================== Rutas ==================
// Subir un comentario
router.post('/subir/:id_publicacion',auth, subir_comentario);
// Obtener todos los comentarios de una publicacion
router.get('/todos/:id_publicacion', obtener_todos_comentarios);
// Obtener comentario por ID
router.get('/uno/:id_comentario', obtener_comentario_id);
// Editar comentario
router.put('/editar/:id_comentario', auth, editar_comentario);
// Eliminar comentario
router.delete('/eliminar/:id_comentario', auth, borrar_comentario);


// ================== Exportar funciones ==================
module.exports = router;