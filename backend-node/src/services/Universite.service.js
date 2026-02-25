const University = require("../models/University.model");

exports.getAll = () => University.find(); 
exports.getById = (id) => University.findById(id);
exports.create = (data) => University.create(data);
exports.update = (id, data) => University.findByIdAndUpdate(id, data, { new: true});
exports.remove = (id) => University.findByIdAndDelete(id);
