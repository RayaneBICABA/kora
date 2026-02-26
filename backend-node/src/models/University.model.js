const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true },
    localisation: { type: String },
});

module.exports = mongoose.model("University", universitySchema);