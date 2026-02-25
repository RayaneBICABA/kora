const express = require("express");
const router = express.Router();
const RessourceController = require("../controllers/Resource.controller");

router.get("/", RessourceController.getAll);
router.get("/:id", RessourceController.getById);
router.post("/", RessourceController.create);
router.put("/:id", RessourceController.update);
router.delete("/:id", RessourceController.remove);

// additional route for downloads
router.patch("/:id/increment-download", RessourceController.incrementDownloads);

module.exports = router;