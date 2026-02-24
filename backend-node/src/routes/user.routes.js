const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User.controller");
const { authenticateToken } = require("../middlewares/auth");

// Routes protégées (nécessitent un token JWT)
router.get("/", authenticateToken, UserController.getAll);
router.get("/:id", authenticateToken, UserController.getById);
router.post("/", authenticateToken, UserController.create);
router.put("/:id", authenticateToken, UserController.update);
router.delete("/:id", authenticateToken, UserController.remove);

module.exports = router;