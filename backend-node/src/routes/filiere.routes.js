const express = require("express");
const router = express.Router();
const FiliereController = require("../controllers/Filiere.controller");

router.get("/", FiliereController.getAll);
router.get("/:id", FiliereController.getById);
router.post("/", FiliereController.create);
router.put("/:id", FiliereController.update);
router.delete("/:id", FiliereController.remove);

module.exports = router;