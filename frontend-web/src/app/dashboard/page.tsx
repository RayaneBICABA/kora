"use client";

import { useState } from "react";

// Types
interface Filiere {
    id: string;
    name: string;
    niveau: string;
    levels: string[];
    icon: "book" | "atom" | "leaf" | "globe" | "chart";
}

const filieres: Filiere[] = [
    {
        id: "1",
        name: "Mathématiques",
        niveau: "LICENCE",
        levels: ["L1", "L2", "L3"],
        icon: "book",
    },
    {
        id: "2",
        name: "Physique Chimie",
        niveau: "LICENCE",
        levels: ["L1", "L2", "L3"],
        icon: "atom",
    },
    {
        id: "3",
        name: "Sciences de la Vie",
        niveau: "LICENCE",
        levels: ["L1", "L2", "L3"],
        icon: "leaf",
    },
    {
        id: "4",
        name: "Histoire-Géographie",
        niveau: "LICENCE",
        levels: ["L1", "L2", "L3"],
        icon: "globe",
    },
    {
        id: "5",
        name: "Sciences Économiques",
        niveau: "LICENCE",
        levels: ["L1", "L2", "L3"],
        icon: "chart",
    },
];

const iconMap = {
    book: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
    atom: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
    ),
    leaf: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    globe: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    chart: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
};

export default function DashboardPage() {
    const [selectedFiliere, setSelectedFiliere] = useState<string | null>(null);

    return (
        <div>
            {/* Filières Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filieres.map((filiere) => (
                    <div
                        key={filiere.id}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-kora-gold/50 transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedFiliere(filiere.id)}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 bg-kora-gold/10 rounded-xl flex items-center justify-center text-kora-gold">
                                {iconMap[filiere.icon]}
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {filiere.niveau}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {filiere.name}
                        </h3>

                        {/* Levels */}
                        <div className="flex gap-2 mb-4">
                            {filiere.levels.map((level) => (
                                <span
                                    key={level}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
                                >
                                    {level}
                                </span>
                            ))}
                        </div>

                        {/* Action */}
                        <button className="w-full py-2.5 text-kora-gold font-medium text-sm hover:bg-kora-gold/5 rounded-lg transition-colors flex items-center justify-center gap-2">
                            Voir plus
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                ))}

                {/* Add New Card */}
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-kora-gold hover:bg-kora-gold/5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[220px]">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <span className="text-gray-500 font-medium">Ajouter une filière</span>
                </div>
            </div>

            {/* Selected Filiere Details (Modal-like display) */}
            {selectedFiliere && (
                <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {filieres.find((f) => f.id === selectedFiliere)?.name}
                        </h3>
                        <button
                            onClick={() => setSelectedFiliere(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-gray-500">
                        Sélectionnez un niveau pour voir les ressources disponibles.
                    </p>
                    <div className="flex gap-3 mt-4">
                        {filieres.find((f) => f.id === selectedFiliere)?.levels.map((level) => (
                            <button
                                key={level}
                                className="px-4 py-2 bg-kora-gold text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
