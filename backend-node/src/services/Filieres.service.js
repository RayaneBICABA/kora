const Filiere = require("../models/Filieres.model");

exports.getAll = () => Filiere.find().populate('universite');
exports.getById = (id) => Filiere.findById(id).populate("universite");
exports.create = (data) => Filiere.create(data);
exports.update = (id, data) => Filiere.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Filiere.findByIdAndDelete(id);