const express = require("express");
const router = express.Router();
const AuthService = require("../services/Auth.service");

// Register - Créer un compte
router.post("/register", async (req, res) => {
    try {
        const { nom, prenom, email, motDePasse, role, niveau, universite } = req.body;

        // Validation
        if (!nom || !prenom || !email || !motDePasse) {
            return res.status(400).json({ 
                error: "nom, prenom, email, et mot de passe sont requis" 
            });
        }

        const result = await AuthService.register({
            nom,
            prenom,
            email,
            motDePasse,
            role,
            niveau,
            universite
        });

        res.status(201).json(result);
    } catch (err) {
        if (err.message.includes("déjà enregistré")) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
});

// Login - Se connecter
router.post("/login", async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        // Validation
        if (!email || !motDePasse) {
            return res.status(400).json({ 
                error: "email et mot de passe sont requis" 
            });
        }

        const result = await AuthService.login(email, motDePasse);
        res.status(200).json(result);
    } catch (err) {
        if (err.message.includes("Invalid")) {
            return res.status(401).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
