const express = require("express");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");
const app = express();

// CORS configuration - allow frontend requests
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}));

// middlewares
app.use(express.json());
app.use(logger);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Home route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to KORA!" });
});

// routes
const routes = require("./routes");
app.use("/api", routes);

// Error handling middleware (doit être en dernier)
app.use(errorHandler);

module.exports = app;
