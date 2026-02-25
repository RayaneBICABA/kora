// Centralized configuration
module.exports = {
    mongodb: {
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kora"
    },
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || "development"
    },
    api: {
        prefix: "/api"
    }
};
