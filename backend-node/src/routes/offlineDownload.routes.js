const express = require("express");
const router = express.Router();
const OfflineController = require("../controllers/OfflineDownload.controller");

router.get("/", OfflineController.getAll);
router.get("/:id", OfflineController.getById);
router.post("/", OfflineController.create);
router.put("/:id", OfflineController.update);
router.delete("/:id", OfflineController.remove);

module.exports = router;