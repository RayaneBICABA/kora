const mongoose = require('mongoose');

const resourcesSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    type: { type: String, required: true},
    fileURL: { type: String, required: true},
    matiere: { type: mongoose.Schema.Types.ObjectId, ref: "Matiere", required: true},
    uploader: { type:  mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    dateUpload: { type: Date, default: Date.now },
    nombreTelechargements: {type: Number, default: 0}
});

module.exports = mongoose.model("resources",  resourcesSchema);