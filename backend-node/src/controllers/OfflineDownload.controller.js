const offlineDownloadService = require('../services/OfflineDownload.service');

exports.getAll = async (req, res)=> {
    try {
        const data = await offlineDownloadService.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await offlineDownloadService.getById(req.params.id);
        if (!data) return res.status(404).json({ message: "Offline download record not found"});
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};

exports.create = async (req, res) => {
    try {
        const data = await offlineDownloadService.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await offlineDownloadService.update(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: "Offline download record not found"});
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const data = await offlineDownloadService.remove(req.params.id);
        if (!data) return res.status(404).json({ message: "Offline download record not found"});
        res.json({ message: "Offline download record removed successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};