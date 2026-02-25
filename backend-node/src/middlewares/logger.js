// Request logging middleware
const logger = (req, res, next) => {
    const start = Date.now();
    const originalSend = res.send;

    res.send = function (data) {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
        res.send = originalSend;
        return res.send(data);
    };

    next();
};

module.exports = logger;
