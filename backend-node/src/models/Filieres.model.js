const mongoose = require('mongoose');

const filiereSchema = new mongoose.Schema({
    nom: { type: String, required: true},
    universite: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true},
});

module.exports = mongoose.model("Filiere", filiereSchema);