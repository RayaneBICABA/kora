const mongoose = require('mongoose');

const niveauSchema = new mongoose.Schema({
    nom: { type: String, required: true},
    universite: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true},
}); 
module.exports = mongoose.model("Niveau", niveauSchema);