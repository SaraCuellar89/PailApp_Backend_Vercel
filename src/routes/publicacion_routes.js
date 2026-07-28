const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');
const upload = require('../middlewares/upload');
const {validar_subir_publicacion} = require('../validators/validaciones_publicaciones')


// ================== Importacion de Controladores ==================
const {subir_publicacion,
    obtener_todas_publicaciones,
    obtener_publicacion_id,
    obtnener_publicaciones_usuario,
    editar_publicacion,
    borrar_publicacion} = require('../controllers/publicacion_controllers');


// ================== Rutas ==================

// Subir publicacion
router.post('/subir', auth, upload.single('archivo'), validar_subir_publicacion, subir_publicacion);
// Obtener todas las publicaciones
router.get('/todas', auth, obtener_todas_publicaciones);
// Obtener una publicacion por su ID
router.get('/una/:id_publicacion', auth, obtener_publicacion_id);
// Obtener todas las publicaciones que ha hecho un usuario
router.get('/todas_usuario', auth, obtnener_publicaciones_usuario);
// Editar publicacion
router.put('/editar/:id_publicacion', auth, upload.single('archivo'), validar_subir_publicacion,  editar_publicacion);
// Eliminar publicacion
router.delete('/eliminar/:id_publicacion', auth, borrar_publicacion);



// ================== Exportar funciones ==================
module.exports = router;