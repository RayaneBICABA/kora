const Resources = require("../models/Resources.model");

exports.getAll =() => Resources.find().populate("matiere").populate("uploader");
exports.getById = (id) => Resources.findById(id).populate("matiere").populate("uploader");
exports.create = (data) => Resources.create(data);
exports.update =(id, data) => Resources.findByIdAndUpdate(id, data);
exports.remove = (id) => Resources.findByIdAndDelete(id);

exports.incrementDownloadCount = async (id) => Resources.findByIdAndUpdate(
    id,
    { $inc: { nombreTelechargements: 1 } },
    { new: true }
);
