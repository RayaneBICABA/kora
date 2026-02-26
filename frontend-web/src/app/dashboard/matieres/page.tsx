"use client";

import { useState, useEffect } from "react";
import { matiereAPI, Matiere, filiereAPI, Filiere, niveauAPI, Niveau, universiteAPI, userAPI } from "@/lib/api";

export default function MatieresPage() {
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [filieres, setFilieres] = useState<Filiere[]>([]);
    const [niveaux, setNiveaux] = useState<Niveau[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newMatiereName, setNewMatiereName] = useState("");
    const [selectedFiliere, setSelectedFiliere] = useState("");
    const [selectedNiveau, setSelectedNiveau] = useState("");
    const [saving, setSaving] = useState(false);
    const [userUniversity, setUserUniversity] = useState<{ _id: string; nom: string } | null>(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userStr = localStorage.getItem("user");
            let universityId = null;

            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.universite) {
                    if (typeof user.universite === 'string') {
                        universityId = user.universite;
                        try {
                            const university = await universiteAPI.getById(user.universite);
                            setUserUniversity({ _id: university._id, nom: university.nom });
                        } catch (e) {
                            console.error("Error fetching university:", e);
                        }
                    } else if (typeof user.universite === 'object') {
                        universityId = user.universite._id;
                        setUserUniversity(user.universite);
                    }
                } else {
                    if (user._id) {
                        try {
                            const userProfile = await userAPI.getById(user._id);
                            if (userProfile.universite) {
                                if (typeof userProfile.universite === 'string') {
                                    universityId = userProfile.universite;
                                    const university = await universiteAPI.getById(userProfile.universite);
                                    setUserUniversity({ _id: university._id, nom: university.nom });
                                } else {
                                    universityId = userProfile.universite._id;
                                    setUserUniversity(userProfile.universite);
                                }
                            }
                        } catch (e) {
                            console.error("Error fetching user profile:", e);
                        }
                    }
                }
            }

            if (universityId) {
                const [filieresData, niveauxData] = await Promise.all([
                    filiereAPI.getAll(),
                    niveauAPI.getAll()
                ]);

                const universityFilieres = filieresData.filter((f: Filiere) =>
                    f.universite &&
                    (typeof f.universite === 'string' ? f.universite === universityId : f.universite._id === universityId)
                );
                const universityNiveaux = niveauxData.filter((n: Niveau) =>
                    n.universite &&
                    (typeof n.universite === 'string' ? n.universite === universityId : n.universite._id === universityId)
                );

                // Use university-specific filieres/niveaux, or all if none exist for this university
                setFilieres(universityFilieres.length > 0 ? universityFilieres : filieresData);
                setNiveaux(universityNiveaux.length > 0 ? universityNiveaux : niveauxData);
            } else {
                // Load all if no university found
                const [filieresData, niveauxData] = await Promise.all([
                    filiereAPI.getAll(),
                    niveauAPI.getAll()
                ]);
                setFilieres(filieresData);
                setNiveaux(niveauxData);
            }

            loadMatieres();
        } catch (err) {
            console.error("Error loading user data:", err);
            setLoading(false);
        }
    };

    const loadMatieres = async () => {
        try {
            setLoading(true);
            const data = await matiereAPI.getAll();
            setMatieres(data);
        } catch (err) {
            setError("Erreur lors du chargement des matières");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) return;

        try {
            await matiereAPI.delete(id);
            setMatieres(matieres.filter(m => m._id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
            console.error(err);
        }
    };

    const handleAddMatiere = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMatiereName.trim()) {
            alert("Veuillez entrer le nom de la matière");
            return;
        }

        if (!selectedFiliere) {
            alert("Veuillez sélectionner une filière");
            return;
        }

        try {
            setSaving(true);
            const data: any = {
                libelle: newMatiereName,
                filiere: selectedFiliere,
            };
            if (selectedNiveau) {
                data.niveau = selectedNiveau;
            }
            const newMatiere = await matiereAPI.create(data);
            setMatieres([...matieres, newMatiere]);
            setShowModal(false);
            setNewMatiereName("");
            setSelectedFiliere("");
            setSelectedNiveau("");
        } catch (err: any) {
            console.error("Error creating matiere:", err);
            alert(err.message || "Erreur lors de la création");
        } finally {
            setSaving(false);
        }
    };

    const filteredMatieres = matieres.filter(matiere =>
        matiere.libelle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by user's university
    const userMatieres = userUniversity
        ? filteredMatieres.filter(m => {
            const filiere = m.filiere as any;
            return filiere && filiere.universite &&
                (typeof filiere.universite === 'string' ? filiere.universite === userUniversity._id : filiere.universite._id === userUniversity._id);
        })
        : filteredMatieres;

    return (
        <div>
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#C58B2B] to-[#D4A03B] rounded-2xl p-6 mb-6">
                <h1 className="text-2xl font-bold text-white">Matières</h1>
                <p className="text-white/80 mt-1">Gérez les matières/modules (Cours d'Algorithmique, etc.)</p>
            </div>

            {/* Search and Add */}
            <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                    <div className="flex items-center bg-[#F0F0F5] rounded-full px-4 py-2">
                        <button className="mr-3 text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            placeholder="Rechercher une matière"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-0 focus:outline-none text-gray-700 placeholder-gray-400"
                        />
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="ml-4 flex items-center gap-2 bg-[#C58B2B] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#B07A25] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Ajouter une matière</span>
                </button>
            </div>

            {/* Matieres List */}
            {loading ? (
                <div className="text-center py-8">Chargement...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b bg-gray-50 text-sm font-medium text-gray-500">
                        <div className="col-span-4">Nom de la matière</div>
                        <div className="col-span-3">Filière</div>
                        <div className="col-span-3">Niveau</div>
                        <div className="col-span-2 text-right">Action</div>
                    </div>

                    {userMatieres.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Aucune matière trouvée
                        </div>
                    ) : (
                        userMatieres.map((matiere) => {
                            const filiere = matiere.filiere as any;
                            const niveau = (matiere as any).niveau;
                            return (
                                <div
                                    key={matiere._id}
                                    className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors items-center"
                                >
                                    <div className="col-span-4">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {matiere.libelle}
                                        </h3>
                                    </div>

                                    <div className="col-span-3">
                                        <span className="text-sm text-gray-600">
                                            {filiere?.nom || "N/A"}
                                        </span>
                                    </div>

                                    <div className="col-span-3">
                                        <span className="text-sm text-gray-600">
                                            {niveau?.nom || "Tous niveaux"}
                                        </span>
                                    </div>

                                    <div className="col-span-2 text-right flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleDelete(matiere._id)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Add Matiere Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Ajouter une matière</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddMatiere}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom de la matière
                                </label>
                                <input
                                    type="text"
                                    value={newMatiereName}
                                    onChange={(e) => setNewMatiereName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C58B2B] focus:outline-none bg-white text-gray-900"
                                    placeholder="Ex: Algorithmique, Bases de données"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filière
                                </label>
                                <select
                                    value={selectedFiliere}
                                    onChange={(e) => setSelectedFiliere(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C58B2B] focus:outline-none bg-white text-gray-900"
                                    required
                                >
                                    <option value="">Sélectionner une filière</option>
                                    {filieres.map((filiere) => (
                                        <option key={filiere._id} value={filiere._id}>
                                            {filiere.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Niveau (optionnel)
                                </label>
                                <select
                                    value={selectedNiveau}
                                    onChange={(e) => setSelectedNiveau(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C58B2B] focus:outline-none bg-white text-gray-900"
                                >
                                    <option value="">Tous les niveaux</option>
                                    {niveaux.map((niveau) => (
                                        <option key={niveau._id} value={niveau._id}>
                                            {niveau.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {userUniversity && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        Université: <span className="font-medium">{userUniversity.nom}</span>
                                    </p>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-[#C58B2B] text-white rounded-lg hover:bg-[#B07A25] transition-colors disabled:opacity-50"
                                >
                                    {saving ? "Création..." : "Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
