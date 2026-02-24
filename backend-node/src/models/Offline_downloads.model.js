const mongoose = require('mongoose');

const offlineDownloadSchema = new mongoose.Schema({
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resources", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    dataSynchro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OfflineDownload', offlineDownloadSchema);
