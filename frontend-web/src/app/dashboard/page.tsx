"use client";

import { useState, useEffect } from "react";
import { userAPI, ressourceAPI, matiereAPI, uploadAPI, Ressource, Matiere } from "@/lib/api";

interface DashboardStats {
    usersCount: number;
    documentsCount: number;
    downloadsCount: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        usersCount: 0,
        documentsCount: 0,
        downloadsCount: 0,
    });
    const [recentResources, setRecentResources] = useState<Ressource[]>([]);
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [newResource, setNewResource] = useState({
        titre: "",
        type: "pdf",
        matiere: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        loadDashboardData();
        loadMatieres();
    }, []);

    const loadMatieres = async () => {
        try {
            const data = await matiereAPI.getAll();
            setMatieres(data);
            if (data.length > 0) {
                setNewResource(prev => ({ ...prev, matiere: data[0]._id }));
            }
        } catch (err) {
            console.error("Error loading matieres:", err);
        }
    };

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            const users = await userAPI.getAll();
            const resources = await ressourceAPI.getAll();

            const totalDownloads = resources.reduce((sum, r) => sum + (r.nombreTelechargements || 0), 0);

            setStats({
                usersCount: users.length,
                documentsCount: resources.length,
                downloadsCount: totalDownloads,
            });

            setRecentResources(resources.slice(0, 5));
        } catch (err) {
            console.error("Error loading dashboard data:", err);
            setStats({
                usersCount: 0,
                documentsCount: 0,
                downloadsCount: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (resource: Ressource) => {
        try {
            await ressourceAPI.incrementDownload(resource._id);

            if (resource.fileURL) {
                const fullUrl = resource.fileURL.startsWith('http')
                    ? resource.fileURL
                    : `http://localhost:3000${resource.fileURL}`;
                window.open(fullUrl, '_blank');
            }

            setRecentResources(recentResources.map(r =>
                r._id === resource._id
                    ? { ...r, nombreTelechargements: (r.nombreTelechargements || 0) + 1 }
                    : r
            ));

            setStats(prev => ({
                ...prev,
                downloadsCount: prev.downloadsCount + 1
            }));
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

        if (!newResource.titre.trim() || !newResource.matiere || !selectedFile) {
            alert("Veuillez remplir tous les champs et sélectionner un fichier");
            return;
        }

        try {
            setSaving(true);

            const uploadResult = await uploadAPI.uploadFile(selectedFile);

            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;

            const created = await ressourceAPI.create({
                titre: newResource.titre,
                type: newResource.type,
                fileURL: uploadResult.url,
                matiere: newResource.matiere,
                uploader: user?._id || "",
            });

            setRecentResources([created, ...recentResources.slice(0, 4)]);
            setStats(prev => ({
                ...prev,
                documentsCount: prev.documentsCount + 1
            }));
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

    const categoryColors: Record<string, { bg: string; text: string }> = {
        cours: { bg: "bg-blue-100", text: "text-blue-600" },
        examen: { bg: "bg-pink-100", text: "text-pink-600" },
        td: { bg: "bg-green-100", text: "text-green-600" },
        corrige: { bg: "bg-purple-100", text: "text-purple-600" },
    };

    const categoryLabels: Record<string, string> = {
        cours: "Cours",
        examen: "Examen",
        td: "TD",
        corrige: "Corrigé",
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Utilisateurs</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {loading ? "..." : stats.usersCount}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#C58B2B]/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#C58B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Documents</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {loading ? "..." : stats.documentsCount}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#C58B2B]/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#C58B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Téléchargements</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {loading ? "..." : stats.downloadsCount}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#C58B2B]/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#C58B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </div>
                    </div>
                </div>
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
                            placeholder="Rechercher un document"
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
                    <span>Ajouter un document</span>
                </button>
            </div>

            {/* Document List Table */}
            {loading ? (
                <div className="text-center py-8">Chargement...</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Titre du document
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Catégorie
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Téléchargements
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentResources.map((doc) => (
                                <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-gray-900 font-medium">{doc.titre}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${categoryColors[doc.type]?.bg || "bg-gray-100"} ${categoryColors[doc.type]?.text || "text-gray-600"}`}>
                                            {categoryLabels[doc.type] || doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {doc.dateUpload ? new Date(doc.dateUpload).toLocaleDateString("fr-FR") : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {doc.nombreTelechargements || 0}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDownload(doc)}
                                                className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors inline-flex items-center gap-1"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Téléch.
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Resource Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Ajouter un document</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
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
                                    Matière
                                </label>
                                <select
                                    value={newResource.matiere}
                                    onChange={(e) => setNewResource({ ...newResource, matiere: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C58B2B] focus:outline-none bg-white text-gray-900"
                                >
                                    {matieres.map((matiere) => (
                                        <option key={matiere._id} value={matiere._id}>
                                            {matiere.libelle}
                                        </option>
                                    ))}
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
