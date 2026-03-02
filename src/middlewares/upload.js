const multer = require('multer');
const storage = multer.memoryStorage();

// Configuracion del archivo que se va a subir a cloudinary
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {

        const tipos_permitidos = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'video/mp4'
        ];

        if (tipos_permitidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'), false);
        }
    }
});

module.exports = upload;