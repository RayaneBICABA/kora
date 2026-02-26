const Matiere = require("../models/Matieres.model");

exports.getAll = (filiereId, niveauId) => {
    const query = {};
    if (filiereId) {
        query.filiere = filiereId;
    }
    if (niveauId) {
        query.niveau = niveauId;
    }
    return Matiere.find(query).populate('niveau').populate('filiere');
};
exports.getById = (id) => Matiere.findById(id).populate("niveau").populate("filiere");
exports.create = (data) => Matiere.create(data);
exports.update = (id, data) => Matiere.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Matiere.findByIdAndDelete(id);
