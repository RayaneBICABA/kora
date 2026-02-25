const express = require("express");
const router = express.Router();
const MatiereController = require("../controllers/Matiere.controller");

router.get("/", MatiereController.getAll);
router.get("/:id", MatiereController.getById);
router.post("/", MatiereController.create);
router.put("/:id", MatiereController.update);
router.delete("/:id", MatiereController.remove);

module.exports = router;