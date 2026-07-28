const conexion = require('../config/databse');


// Registrar ingredientes
const insertar_ingredientes = async ({id_usuario, id_publicacion, ingredientes}) => {

    for (const ing of ingredientes)  {
        await conexion.execute(
            `INSERT INTO ingrediente_guardado (id_usuario, id_publicacion, nombre, obtenido) VALUES (?, ?, ?, ?)`, 
            [id_usuario, id_publicacion, ing.nombre, ing.obtenido]
        );
    }
}


// Listar todos los ingredientes
const listar_todos_ingredientes = async ({id_usuario, id_publicacion}) => {
    const [resultado] = await conexion.execute('SELECT * FROM ingrediente_guardado WHERE id_usuario = ? AND id_publicacion = ?', [id_usuario, id_publicacion]);

    return resultado;
}


// Listar ingrediente por su id
const lista_ingrediente_id = async ({id_ingrediente}) => {
    const [resultado] = await conexion.execute('SELECT * FROM ingrediente_guardado WHERE id_ingrediente = ?', [id_ingrediente]);

    return resultado;
}


// Editar el estado del ingrediente (obtenido)
const editar_estado_ingrediente = async ({id_ingrediente, obtenido}) => {
    const [resultado] = await conexion.execute('UPDATE ingrediente_guardado SET obtenido = ? WHERE id_ingrediente = ?', [obtenido, id_ingrediente]);

    return resultado;
}


// Eliminar todos los ingredientes que tienen relacion con una publicacion
const eliminar_todos_ingredientes = async ({id_publicacion, id_usuario}) => {
    const [resultado] = await conexion.execute('DELETE FROM ingrediente_guardado WHERE id_publicacion = ? and id_usuario = ?', [id_publicacion, id_usuario]);

    return resultado;
}



// ================== Exportar funciones ==================
module.exports = {
    insertar_ingredientes, 
    listar_todos_ingredientes,
    lista_ingrediente_id,
    editar_estado_ingrediente,
    eliminar_todos_ingredientes
}