const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    admin: { type: String, required: true },
    imagePath: { type: String, required: true },
    claveTemp: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
