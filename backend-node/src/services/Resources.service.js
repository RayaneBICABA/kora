const Resources = require("../models/Resources.model");

exports.getAll = () => Resources.find()
    .populate({
        path: 'matiere',
        populate: {
            path: 'filiere',
            populate: {
                path: 'universite'
            }
        }
    })
    .populate('uploader');
exports.getById = (id) => Resources.findById(id)
    .populate({
        path: 'matiere',
        populate: {
            path: 'filiere',
            populate: {
                path: 'universite'
            }
        }
    })
    .populate('uploader');
exports.create = (data) => Resources.create(data);
exports.update =(id, data) => Resources.findByIdAndUpdate(id, data);
exports.remove = (id) => Resources.findByIdAndDelete(id);

exports.incrementDownloadCount = async (id) => Resources.findByIdAndUpdate(
    id,
    { $inc: { nombreTelechargements: 1 } },
    { new: true }
);
