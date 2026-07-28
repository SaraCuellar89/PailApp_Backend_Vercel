const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport")


// ================== Middlewares ==================
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(passport.initialize());


// ================== Importacion de Rutas ==================
const rutas_usuario = require("./src/routes/usuarios_routes");
const rutas_token_fcm = require("./src/routes/token_fcm_routes");
const rutas_publicaciones = require('./src/routes/publicacion_routes');
const rutas_comentarios = require('./src/routes/comentarios_routes');
const rutas_reacciones = require('./src/routes/reacciones_routes');
const rutas_guardados = require('./src/routes/guardados_routes');
const rutas_ingredientes = require('./src/routes/lista_ingredientes_routes');
const rutas_respuestas = require('./src/routes/respuestas_routes');
const rutas_notificaciones = require('./src/routes/notificaciones_routes');
const rutas_filtros = require('./src/routes/filtros_routes');


// ================== Rutas ==================
// Test
app.get('/', (req, res) => {
    res.send("<h1>Hola desde el Backend</h1>")
})

// Usuarios
app.use('/usuarios', rutas_usuario);
// Token FCM
app.use('/tokenFCM', rutas_token_fcm);
// Publicaciones
app.use('/publicaciones', rutas_publicaciones);
// Comentarios
app.use('/comentarios', rutas_comentarios);
// Reacciones
app.use('/reacciones', rutas_reacciones);
// Platos Guardados
app.use('/guardados', rutas_guardados);
// Lista de Ingredientes
app.use('/ingredientes', rutas_ingredientes);
// Respuestas a comentarios
app.use('/respuestas', rutas_respuestas);
// Notificaciones
app.use('/notificaciones', rutas_notificaciones);
// Filtros
app.use('/filtros', rutas_filtros);


// ================== Escucha del puerto (numero de puerto en .evn) ================== 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});