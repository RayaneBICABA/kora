const UserService = require("../services/User.service");

exports.getAll = async (req, res) => {
    try {
        const data = await UserService.getAll();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await UserService.getById(req.params.id);
        if (!data) return res.status(404).json({ message: "User not found"});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = await UserService.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
}
};

exports.update = async (req, res) => {
    try {
        const data = await UserService.update(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: "User not found"});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const data = await UserService.remove(req.params.id);
        if (!data) return res.status(404).json({ message: "User not found"});
        res.status(200).json({ message: "User removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};