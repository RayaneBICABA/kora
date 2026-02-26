const offlineDownload = require("../models/Offline_downloads.model");

exports.getAll = () => offlineDownload.find().populate("resourceId").populate("userId");
exports.getById = (id) => offlineDownload.findById(id).populate("resourceId").populate("userId");
exports.create = (data) => offlineDownload.create(data);
exports.update = (id, data) => offlineDownload.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => offlineDownload.findByIdAndDelete(id);
