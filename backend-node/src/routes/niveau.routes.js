const express = require("express");
const router = express.Router();
const NiveauController = require("../controllers/Niveau.controller");

router.get("/", NiveauController.getAll);
router.get("/:id", NiveauController.getById);
router.post("/", NiveauController.create);
router.put("/:id", NiveauController.update);
router.delete("/:id", NiveauController.remove);

module.exports = router;