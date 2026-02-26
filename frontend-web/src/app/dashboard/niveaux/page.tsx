"use client";

import { useState, useEffect } from "react";
import { niveauAPI, Niveau, universiteAPI, userAPI } from "@/lib/api";

export default function NiveauxPage() {
    const [niveaux, setNiveaux] = useState<Niveau[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newNiveauName, setNewNiveauName] = useState("");
    const [saving, setSaving] = useState(false);
    const [userUniversity, setUserUniversity] = useState<{ _id: string; nom: string } | null>(null);

    useEffect(() => {
        loadNiveaux();
        loadUserUniversity();
    }, []);

    const loadUserUniversity = async () => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.universite) {
                    if (typeof user.universite === 'string') {
                        try {
                            const university = await universiteAPI.getById(user.universite);
                            setUserUniversity({ _id: university._id, nom: university.nom });
                        } catch (e) {
                            console.error("Error fetching university:", e);
                        }
                    } else if (typeof user.universite === 'object') {
                        setUserUniversity(user.universite);
                    }
                } else {
                    if (user._id) {
                        try {
                            const userProfile = await userAPI.getById(user._id);
                            if (userProfile.universite) {
                                if (typeof userProfile.universite === 'string') {
                                    const university = await universiteAPI.getById(userProfile.universite);
                                    setUserUniversity({ _id: university._id, nom: university.nom });
                                } else {
                                    setUserUniversity(userProfile.universite);
                                }
                            }
                        } catch (e) {
                            console.error("Error fetching user profile:", e);
                        }
                    }
                }
            } catch (e) {
                console.error("Error parsing user:", e);
            }
        }
    };

    const loadNiveaux = async () => {
        try {
            setLoading(true);
            const data = await niveauAPI.getAll();
            setNiveaux(data);
        } catch (err) {
            setError("Erreur lors du chargement des niveaux");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce niveau ?")) return;

        try {
            await niveauAPI.delete(id);
            setNiveaux(niveaux.filter(n => n._id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
            console.error(err);
        }
    };

    const handleAddNiveau = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Creating niveau with:", { nom: newNiveauName });

        if (!newNiveauName.trim()) {
            alert("Veuillez entrer le nom du niveau");
            return;
        }

        if (!userUniversity) {
            alert("Aucune université trouvée pour votre compte");
            return;
        }

        try {
            setSaving(true);
            const newNiveau = await niveauAPI.create({
                nom: newNiveauName,
                universite: userUniversity._id,
            });
            setNiveaux([...niveaux, newNiveau]);
            setShowModal(false);
            setNewNiveauName("");
        } catch (err: any) {
            console.error("Error creating niveau:", err);
            alert(err.message || "Erreur lors de la création");
        } finally {
            setSaving(false);
        }
    };

    const filteredNiveaux = niveaux.filter(niveau =>
        niveau.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by user's university
    const userNiveaux = userUniversity
        ? filteredNiveaux.filter(n =>
            n.universite &&
            (typeof n.universite === 'string' ? n.universite === userUniversity._id : n.universite._id === userUniversity._id)
        )
        : filteredNiveaux;

    return (
        <div className="p-4 lg:p-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#C58B2B] to-[#D4A03B] rounded-2xl p-4 lg:p-6 mb-6">
                <h1 className="text-xl lg:text-2xl font-bold text-white">Niveaux</h1>
                <p className="text-white/80 mt-1 text-sm lg:text-base">Gérez les niveaux académiques (Licence 1, Master 1, etc.)</p>
            </div>

            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="relative w-full sm:max-w-md">
                    <div className="flex items-center bg-[#F0F0F5] rounded-full px-4 py-2">
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Rechercher un niveau"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-0 focus:outline-none text-gray-700 placeholder-gray-400 ml-2"
                        />
                    </div>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C58B2B] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#B07A25] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="sm:hidden lg:inline">Ajouter un niveau</span>
                </button>
            </div>

            {/* Niveaux List */}
            {loading ? (
                <div className="text-center py-8">Chargement...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 border-b bg-gray-50 text-sm font-medium text-gray-500">
                        <div className="col-span-8">Nom du niveau</div>
                        <div className="col-span-3">Université</div>
                        <div className="col-span-1 text-right">Action</div>
                    </div>

                    {userNiveaux.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Aucun niveau trouvé
                        </div>
                    ) : (
                        userNiveaux.map((niveau) => (
                            <div
                                key={niveau._id}
                                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors items-center"
                            >
                                <div className="md:col-span-8">
                                    <span className="md:hidden font-medium text-gray-500 text-sm">Nom: </span>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        {niveau.nom}
                                    </h3>
                                </div>

                                <div className="md:col-span-3">
                                    <span className="md:hidden font-medium text-gray-500 text-sm">Université: </span>
                                    <span className="text-sm text-gray-600">
                                        {typeof niveau.universite === 'object' ? niveau.universite.nom : "N/A"}
                                    </span>
                                </div>

                                <div className="md:col-span-1 text-right flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleDelete(niveau._id)}
                                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Add Niveau Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Ajouter un niveau</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddNiveau}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom du niveau
                                </label>
                                <input
                                    type="text"
                                    value={newNiveauName}
                                    onChange={(e) => setNewNiveauName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C58B2B] focus:outline-none bg-white text-gray-900"
                                    placeholder="Ex: Licence 1, Master 1, Doctorat"
                                />
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
