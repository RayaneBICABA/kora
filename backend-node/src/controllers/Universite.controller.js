const UniversityService = require("../services/Universite.service");

exports.getAll = async (req, res) => {
    try {
        const  data = await UniversityService.getAll();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await UniversityService.getById(req.params.id);
        if (!data) return res.status(404).json({ message: "University not found"});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.create = async (req, res) => {
    try {
        const data = await UniversityService.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = await UniversityService.update(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: "University not found"});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const data = await UniversityService.remove(req.params.id);
        if (!data) return res.status(404).json({ message: "University not found"});
        res.status(200).json({ message: "University removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};