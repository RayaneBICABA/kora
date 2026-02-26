const ressourceService =  require('../services/Resources.service');

exports.getAll = async (req, res) => {
    try {
        const data = await ressourceService.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

exports.getById =  async (req, res) => {
    try {
        const data = await ressourceService.getById(req.params.id);
        if (!data) return res.status(404).json({ message: "Resource not found"});
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create =  async (req, res) => {
    try {
        const data = await ressourceService.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await ressourceService.update(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: "Resource not found"});
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const data = await ressourceService.remove(req.params.id);
        if (!data) return res.status(404).json({ message: "Resource not found"});
        res.json({ message: "Resource removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.incrementDownloads = async (req, res) => {
    try {
        const data = await ressourceService.incrementDownloads(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};