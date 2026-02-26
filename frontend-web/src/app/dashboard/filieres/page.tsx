"use client";

import { useState, useEffect } from "react";
import { filiereAPI, Filiere, universiteAPI, userAPI } from "@/lib/api";

export default function FilieresPage() {
    const [filieres, setFilieres] = useState<Filiere[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newFiliereName, setNewFiliereName] = useState("");
    const [saving, setSaving] = useState(false);
    const [userUniversity, setUserUniversity] = useState<{ _id: string; nom: string } | null>(null);

    useEffect(() => {
        loadFilieres();
        loadUserUniversity();
    }, []);

    const loadUserUniversity = async () => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                // Handle both string and object formats for universite
                if (user.universite) {
                    if (typeof user.universite === 'string') {
                        // If it's just an ID, fetch the university details from API
                        try {
                            const university = await universiteAPI.getById(user.universite);
                            setUserUniversity({ _id: university._id, nom: university.nom });
                        } catch (e) {
                            console.error("Error fetching university:", e);
                            // Fallback to placeholder
                            setUserUniversity({ _id: user.universite, nom: "Université" });
                        }
                    } else if (typeof user.universite === 'object') {
                        setUserUniversity(user.universite);
                    }
                } else {
                    // No university in localStorage - fetch from API using user ID
                    if (user._id) {
                        try {
                            const userProfile = await userAPI.getById(user._id);
                            if (userProfile.universite) {
                                if (typeof userProfile.universite === 'string') {
                                    const university = await universiteAPI.getById(userProfile.universite);
                                    setUserUniversity({ _id: university._id, nom: university.nom });
                                } else if (typeof userProfile.universite === 'object') {
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

    const loadFilieres = async () => {
        try {
            setLoading(true);
            const data = await filiereAPI.getAll();
            setFilieres(data);
        } catch (err) {
            setError("Erreur lors du chargement des filières");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette filière ?")) return;

        try {
            await filiereAPI.delete(id);
            setFilieres(filieres.filter(f => f._id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
            console.error(err);
        }
    };

    const handleAddFiliere = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Creating filiere with:", { nom: newFiliereName });

        if (!newFiliereName.trim()) {
            alert("Veuillez entrer le nom de la filière");
            return;
        }

        if (!userUniversity) {
            alert("Aucune université trouvée pour votre compte");
            return;
        }

        try {
            setSaving(true);
            const newFiliere = await filiereAPI.create({
                nom: newFiliereName,
                universite: userUniversity._id,
            });
            setFilieres([...filieres, newFiliere]);
            setShowModal(false);
            setNewFiliereName("");
        } catch (err: any) {
            console.error("Error creating filiere:", err);
            alert(err.message || "Erreur lors de la création");
        } finally {
            setSaving(false);
        }
    };

    const filteredFilieres = filieres.filter(filiere =>
        filiere.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 lg:p-8">
            {/* Golden Banner */}
            <div className="bg-[#C59436] rounded-2xl p-4 lg:p-8 mb-6 lg:mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Left - Illustration placeholder - Hidden on small screens */}
                <div className="hidden lg:block w-1/3">
                    <div className="bg-white/20 rounded-xl p-4 h-48 flex items-center justify-center">
                        <svg className="w-32 h-32 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                </div>

                {/* Right - Text */}
                <div className="w-full lg:w-2/3 text-center lg:text-right">
                    <p className="text-white text-sm lg:text-lg font-medium mb-2">
                        Organisez efficacement vos documents en gérant vos filières
                    </p>
                    <p className="text-white text-2xl lg:text-4xl font-bold">{filieres.length} Filières</p>
                </div>
            </div>

            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                {/* Search Bar - Pill shaped, lavender gray */}
                <div className="relative w-full sm:max-w-md">
                    <div className="flex items-center bg-[#F0F0F5] rounded-full px-4 py-2">
                        {/* Search icon */}
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Rechercher une filière"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-0 focus:outline-none text-gray-700 placeholder-gray-400 ml-2"
                        />
                    </div>
                </div>

                {/* Add Filière Button */}
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C58B2B] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#B07A25] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="sm:hidden lg:inline">Ajouter une filière</span>
                </button>
            </div>

            {/* Filières Table - Responsive container */}
            {loading ? (
                <div className="text-center py-8">Chargement...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
                    <table className="w-full min-w-[500px] lg:min-w-0">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Nom de la filière
                                </th>
                                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Université
                                </th>
                                <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredFilieres.map((filiere) => (
                                <tr key={filiere._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                                        <span className="text-gray-900 font-medium">{filiere.nom}</span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-500 text-sm">
                                        {filiere.universite?.nom || userUniversity?.nom || "N/A"}
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(filiere._id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Filière Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Ajouter une filière</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddFiliere}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Université
                                </label>
                                <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600">
                                    {userUniversity?.nom || "Université de l'administrateur"}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    L'université est automatiquement associée à votre compte
                                </p>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom de la filière
                                </label>
                                <input
                                    type="text"
                                    value={newFiliereName}
                                    onChange={(e) => setNewFiliereName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C58B2B] focus:outline-none bg-white text-gray-900"
                                    placeholder="Ex: Informatique, Médecine, etc."
                                />
                            </div>
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
