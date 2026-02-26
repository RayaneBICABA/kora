"use client";

import React, { useState, useEffect } from "react";
import { ressourceAPI, matiereAPI, uploadAPI, Ressource, Matiere, filiereAPI, Filiere, universiteAPI, userAPI, niveauAPI, Niveau } from "@/lib/api";

const fileTypeConfig: Record<string, { bg: string; text: string; label: string }> = {
    pdf: { bg: "bg-red-100", text: "text-red-600", label: "PDF" },
    doc: { bg: "bg-blue-100", text: "text-blue-600", label: "DOC" },
    docx: { bg: "bg-blue-100", text: "text-blue-600", label: "DOC" },
    xls: { bg: "bg-green-100", text: "text-green-600", label: "XLS" },
    xlsx: { bg: "bg-green-100", text: "text-green-600", label: "XLS" },
    ppt: { bg: "bg-orange-100", text: "text-orange-600", label: "PPT" },
    pptx: { bg: "bg-orange-100", text: "text-orange-600", label: "PPT" },
};

export default function RessourcesPage() {
    const [resources, setResources] = useState<Ressource[]>([]);
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [filieres, setFilieres] = useState<Filiere[]>([]);
    const [niveaux, setNiveaux] = useState<Niveau[]>([]);
    const [selectedFiliere, setSelectedFiliere] = useState<string>("");
    const [selectedNiveau, setSelectedNiveau] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [userUniversity, setUserUniversity] = useState<{ _id: string; nom: string } | null>(null);

    // Form state
    const [newResource, setNewResource] = useState({
        titre: "",
        type: "pdf",
        matiere: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        if (selectedFiliere || selectedNiveau) {
            loadMatieres(selectedFiliere || undefined, selectedNiveau || undefined);
        }
    }, [selectedFiliere, selectedNiveau]);

    const loadUserData = async () => {
        try {
            const userStr = localStorage.getItem("user");
            let universityId = null;

            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.universite) {
                    if (typeof user.universite === 'string') {
                        universityId = user.universite;
                    } else if (typeof user.universite === 'object') {
                        universityId = user.universite._id;
                        setUserUniversity(user.universite);
                    }
                } else {
                    // Fetch from API if not in localStorage
                    if (user._id) {
                        try {
                            const userProfile = await userAPI.getById(user._id);
                            if (userProfile.universite) {
                                if (typeof userProfile.universite === 'string') {
                                    universityId = userProfile.universite;
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
                // Load filieres and niveaux for this university
                const [filieresData, niveauxData] = await Promise.all([
                    filiereAPI.getAll(),
                    niveauAPI.getAll()
                ]);
                const universityFilieres = filieresData.filter((f: Filiere) =>
                    f.universite &&
                    (typeof f.universite === 'string' ? f.universite === universityId : f.universite._id === universityId)
                );
                setFilieres(universityFilieres);

                const universityNiveaux = niveauxData.filter((n: Niveau) =>
                    n.universite &&
                    (typeof n.universite === 'string' ? n.universite === universityId : n.universite._id === universityId)
                );
                setNiveaux(universityNiveaux);

                if (universityFilieres.length > 0) {
                    setSelectedFiliere(universityFilieres[0]._id);
                }
            }

            loadResources();
        } catch (err) {
            console.error("Error loading user data:", err);
            setLoading(false);
        }
    };

    const loadMatieres = async (filiereId?: string, niveauId?: string) => {
        try {
            const data = await matiereAPI.getAll(filiereId, niveauId);
            setMatieres(data);
            if (data.length > 0) {
                setNewResource(prev => ({ ...prev, matiere: data[0]._id }));
            } else {
                setNewResource(prev => ({ ...prev, matiere: "" }));
            }
        } catch (err) {
            console.error("Error loading matieres:", err);
        }
    };

    const loadResources = async () => {
        try {
            setLoading(true);
            const data = await ressourceAPI.getAll();
            setResources(data);
        } catch (err) {
            setError("Erreur lors du chargement des ressources");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) return;

        try {
            await ressourceAPI.delete(id);
            setResources(resources.filter(r => r._id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
            console.error(err);
        }
    };

    const handleDownload = async (resource: Ressource) => {
        try {
            await ressourceAPI.incrementDownload(resource._id);

            if (resource.fileURL) {
                // Convert relative URL to full URL if needed
                const fullUrl = resource.fileURL.startsWith('http')
                    ? resource.fileURL
                    : `http://localhost:3000${resource.fileURL}`;
                window.open(fullUrl, '_blank');
            }

            setResources(resources.map(r =>
                r._id === resource._id
                    ? { ...r, nombreTelechargements: (r.nombreTelechargements || 0) + 1 }
                    : r
            ));
        } catch (err) {
            console.error("Error during download:", err);
            if (resource.fileURL) {
                const fullUrl = resource.fileURL.startsWith('http')
                    ? resource.fileURL
                    : `http://localhost:3000${resource.fileURL}`;
                window.open(fullUrl, '_blank');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Auto-detect type from extension
            const ext = file.name.split('.').pop()?.toLowerCase();
            const typeMap: Record<string, string> = {
                'pdf': 'pdf',
                'doc': 'doc',
                'docx': 'docx',
                'xls': 'xls',
                'xlsx': 'xlsx',
                'ppt': 'ppt',
                'pptx': 'pptx',
            };
            if (ext && typeMap[ext]) {
                setNewResource(prev => ({ ...prev, type: typeMap[ext] }));
            }
        }
    };

    const handleAddResource = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFiliere || !newResource.titre.trim() || !newResource.matiere || !selectedFile) {
            alert("Veuillez sélectionner une filière et remplir tous les champs");
            return;
        }

        try {
            setSaving(true);

            // Upload file first
            const uploadResult = await uploadAPI.uploadFile(selectedFile);

            // Get current user from localStorage
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;

            // Create resource with uploaded file URL
            const created = await ressourceAPI.create({
                titre: newResource.titre,
                type: newResource.type,
                fileURL: uploadResult.url,
                matiere: newResource.matiere,
                uploader: user?._id || "",
            });

            setResources([created, ...resources]);
            setShowModal(false);
            setNewResource({ titre: "", type: "pdf", matiere: matieres[0]?._id || "" });
            setSelectedFile(null);
        } catch (err: any) {
            alert(err.message || "Erreur lors de la création");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const filteredResources = resources.filter(resource =>
        resource.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.matiere?.libelle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getFileConfig = (type: string) => {
        return fileTypeConfig[type.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-600", label: type.toUpperCase() };
    };

    return (
        <div className="p-4 lg:p-8">
            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="relative w-full sm:max-w-md">
                    <div className="flex items-center bg-[#F0F0F5] rounded-full px-4 py-2">
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Rechercher une ressource"
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
                    <span className="sm:hidden lg:inline">Ajouter une ressource</span>
                </button>
            </div>

            {/* Resources List */}
            {loading ? (
                <div className="text-center py-8">Chargement...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 border-b bg-gray-50 text-sm font-medium text-gray-500">
                        <div className="col-span-1">Fichier</div>
                        <div className="col-span-4">Cours</div>
                        <div className="col-span-3">Université</div>
                        <div className="col-span-2 text-center">Télécharg.</div>
                        <div className="col-span-1">Date</div>
                        <div className="col-span-1 text-right">Action</div>
                    </div>

                    {filteredResources.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Aucune ressource trouvée
                        </div>
                    ) : (
                        filteredResources.map((resource) => {
                            const config = getFileConfig(resource.type);
                            return (
                                <div
                                    key={resource._id}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors items-center"
                                >
                                    <div className="md:col-span-1 flex items-center gap-3">
                                        <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                            <span className={`${config.text} font-bold text-xs`}>
                                                {config.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="md:col-span-4">
                                        <span className="md:hidden font-medium text-gray-500 text-sm">Cours: </span>
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {resource.titre}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5 md:hidden">
                                            {resource.matiere?.libelle || "N/A"}
                                        </p>
                                    </div>

                                    <div className="md:col-span-3">
                                        <span className="md:hidden font-medium text-gray-500 text-sm">Université: </span>
                                        <span className="text-sm text-gray-600">
                                            {resource.matiere?.filiere?.universite?.nom || "N/A"}
                                        </span>
                                    </div>

                                    <div className="md:col-span-2 flex items-center gap-1 text-gray-600 md:justify-center">
                                        <svg className="w-4 h-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span className="text-sm">{resource.nombreTelechargements || 0}</span>
                                    </div>

                                    <div className="md:col-span-1">
                                        <span className="md:hidden font-medium text-gray-500 text-sm">Date: </span>
                                        <span className="text-sm text-gray-500">
                                            {resource.dateUpload ? new Date(resource.dateUpload).toLocaleDateString("fr-FR") : "N/A"}
                                        </span>
                                    </div>

                                    <div className="md:col-span-1 text-right flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleDownload(resource)}
                                            className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors inline-flex items-center gap-1"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            <span className="hidden md:inline">Téléch.</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(resource._id)}
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

            {filteredResources.length > 0 && (
                <div className="mt-6 text-center">
                    <button className="px-6 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-lg hover:border-[#C58B2B] hover:text-[#C58B2B] transition-colors">
                        Charger plus de ressources
                    </button>
                </div>
            )}

            {/* Add Resource Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Ajouter une ressource</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddResource}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre du document
                                </label>
                                <input
                                    type="text"
                                    value={newResource.titre}
                                    onChange={(e) => setNewResource({ ...newResource, titre: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C58B2B] focus:outline-none bg-white text-gray-900"
                                    placeholder="Ex: Cours d'Algèbre Linéaire"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type de fichier
                                </label>
                                <select
                                    value={newResource.type}
                                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C58B2B] focus:outline-none bg-white text-gray-900"
                                >
                                    <option value="pdf">PDF</option>
                                    <option value="doc">Word (DOC)</option>
                                    <option value="docx">Word (DOCX)</option>
                                    <option value="xls">Excel (XLS)</option>
                                    <option value="xlsx">Excel (XLSX)</option>
                                    <option value="ppt">PowerPoint (PPT)</option>
                                    <option value="pptx">PowerPoint (PPTX)</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filière
                                </label>
                                <select
                                    value={selectedFiliere}
                                    onChange={(e) => setSelectedFiliere(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C58B2B] focus:outline-none bg-white text-gray-900"
                                    disabled={filieres.length === 0}
                                >
                                    {filieres.length === 0 ? (
                                        <option value="">Aucune filière disponible</option>
                                    ) : (
                                        <option value="">Sélectionner une filière</option>
                                    )}
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
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Matière
                                </label>
                                <select
                                    value={newResource.matiere}
                                    onChange={(e) => setNewResource({ ...newResource, matiere: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C58B2B] focus:outline-none bg-white text-gray-900"
                                    disabled={!selectedFiliere || matieres.length === 0}
                                >
                                    {matieres.length === 0 ? (
                                        <option value="">Aucune matière disponible</option>
                                    ) : (
                                        matieres.map((matiere) => (
                                            <option key={matiere._id} value={matiere._id}>
                                                {matiere.libelle}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fichier (PDF, DOC, XLS, PPT)
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C58B2B] focus:outline-none bg-white text-gray-900"
                                />
                                {selectedFile && (
                                    <p className="mt-2 text-sm text-green-600">
                                        Fichier sélectionné: {selectedFile.name}
                                    </p>
                                )}
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