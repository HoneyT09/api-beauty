const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    fechaEntrega: { type: Date, required: true },
    formaPago: { type: String, required: true },
    numeroPersonas: { type: String, required: true },
    evento: { type: String, required: true },
    descripcion: { type: String, required: true },
    categoria:{ type: String, required: true },
    imagePath: {type: String, required: true},
    usuario: {type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema);