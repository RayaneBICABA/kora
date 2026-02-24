require("dotenv").config();
const app = require("./src/app");
const mongoose = require("mongoose");
const config = require("./src/config/config");

mongoose
  .connect(config.mongodb.uri)
  .then(() => {
    console.log(" MongoDB connected successfully");
    app.listen(config.server.port, () => console.log(` Serveur lancé sur http://localhost:${config.server.port}`));
  })
  .catch((err) => console.error("Erreur MongoDB", err));