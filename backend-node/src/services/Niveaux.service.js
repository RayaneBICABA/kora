const Niveau = require("../models/Niveaux.model");
exports.getAll = () => Niveau.find().populate('universite');
exports.getById = (id) => Niveau.findById(id).populate('universite');
exports.create = (data) => Niveau.create(data);
exports.update = (id, data) => Niveau.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Niveau.findByIdAndDelete(id);