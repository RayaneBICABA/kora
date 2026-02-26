const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['etudiant', 'admin'], 
        required: true 
    },
    niveau : { type: mongoose.Schema.Types.ObjectId, ref: "Niveau"},
    universite: { type: mongoose.Schema.Types.ObjectId, ref: "University"}
});

module.exports = mongoose.model("User", userSchema);