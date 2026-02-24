const express = require("express");
const router = express.Router();
const UniversiteController = require("../controllers/Universite.controller");

router.get("/", UniversiteController.getAll);
router.get("/:id", UniversiteController.getById);
router.post("/", UniversiteController.create);
router.put("/:id", UniversiteController.update);
router.delete("/:id", UniversiteController.remove);

module.exports = router;