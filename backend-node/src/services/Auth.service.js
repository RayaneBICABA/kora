const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

exports.register = async (data) => {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        throw new Error("Email already registered");
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.motDePasse, 10);
    
    // Créer le nouvel utilisateur
    const newUser = await User.create({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        motDePasse: hashedPassword,
        role: data.role || "etudiant",
        niveau: data.niveau,
        universite: data.universite
    });

    // Générer le token JWT
    const token = jwt.sign(
        { 
            userId: newUser._id, 
            email: newUser.email,
            role: newUser.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );

    return {
        user: {
            _id: newUser._id,
            nom: newUser.nom,
            prenom: newUser.prenom,
            email: newUser.email,
            role: newUser.role
        },
        token
    };
};

exports.login = async (email, motDePasse) => {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // Générer le token JWT
    const token = jwt.sign(
        { 
            userId: user._id, 
            email: user.email,
            role: user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );

    return {
        user: {
            _id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role
        },
        token
    };
};

exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};
