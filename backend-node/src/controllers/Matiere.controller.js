const MatiereService = require('../services/Matiere.service');

exports.getAll = async (req, res) => {
    try {
        const filiereId = req.query.filiere;
        const niveauId = req.query.niveau;
        const data = await MatiereService.getAll(filiereId, niveauId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await MatiereService.getById(req.params.id);
        if (!data) return res.status(404).json({ message: "subject not found" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = await MatiereService.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await MatiereService.update(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: "Subject not found" });
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const data = await MatiereService.remove(req.params.id);
        if (!data) return res.status(404).json({ message: "Subject not found" });
        res.json({ message: "Subject removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};