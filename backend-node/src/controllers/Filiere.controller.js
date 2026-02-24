const FiliereService = require("../services/Filieres.service");

exports.getAll = async (req, res) => {
    try {
        const data = await FiliereService.getAll();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await FiliereService.getById(req.params.id);
        if (!data) return res.status(404).json({ message: "Filiere not found"});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = await FiliereService.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await FiliereService.update(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: "Filiere not found"});
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const data =await FiliereService.remove(req.params.id);
        if (!data) return res.status(404).json({ message:" Filiere not found"});
        res.status(200).json({ message: "Filiere removed successfully"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
