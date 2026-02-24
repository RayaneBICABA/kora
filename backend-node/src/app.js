const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");
const app = express();

// middlewares
app.use(express.json());
app.use(logger);

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