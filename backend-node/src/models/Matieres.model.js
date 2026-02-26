const mongoose = require('mongoose');

const matiereSchema = new mongoose.Schema({
    libelle: { type: String, required: true },
    filiere: { type: mongoose.Schema.Types.ObjectId, ref: "Filiere", required: true },
    niveau: { type: mongoose.Schema.Types.ObjectId, ref: "Niveau" },
});

module.exports = mongoose.model("Matiere", matiereSchema);