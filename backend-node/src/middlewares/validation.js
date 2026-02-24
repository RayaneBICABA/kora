// Request validation middleware
const validateObjectId = (req, res, next) => {
    const id = req.params.id;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }
    next();
};

// Body validation middleware
const validateBody = (schema) => {
    return (req, res, next) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Request body is required" });
        }
        next();
    };
};

module.exports = {
    validateObjectId,
    validateBody
};
