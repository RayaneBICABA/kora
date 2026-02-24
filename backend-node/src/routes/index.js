const express = require("express");
const router = express.Router();

// Auth routes (public)
router.use("/auth", require("./auth.routes"));

// Other routes
router.use("/universites", require("./universite.routes"));
router.use("/filieres", require("./filiere.routes"));
router.use("/niveaux", require("./niveau.routes"));
router.use("/matieres", require("./matiere.routes"));
router.use("/ressources", require("./ressources.routes"));
router.use("/users", require("./user.routes"));
router.use("/offline-downloads", require("./offlineDownload.routes"));

module.exports = router;