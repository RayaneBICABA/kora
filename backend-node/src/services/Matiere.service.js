const Matiere = require("../models/Matieres.model");
exports.getAll = () => Matiere.find().populate('Niveau');
exports.getById = (id) => Matiere.findById(id).populate("Niveau");
exports.create = (data) => Matiere.create(data);
exports.update = (id, data) => Matiere.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Matiere.findByIdAndDelete(id);
