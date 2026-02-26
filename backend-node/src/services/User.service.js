const User = require("../models/User.model");

exports.getAll = () => User.find().populate("universite").populate("niveau");
exports.getById = (id) => User.findById(id).populate("universite").populate("niveau");
exports.create = (data) => User.create(data);
exports.update = (id, data) => User.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => User.findByIdAndDelete(id);