const  Niveau =  require("../models/Niveaux.model");
exports.getAll = () => Niveau.find().populate('filiere');
exports.getById = (id) => Niveau.findById(id).populate("filiere");
exports.create = (data) => Niveau.create(data);
exports.update = (id, data) => Niveau.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Niveau.findByIdAndDelete(id);