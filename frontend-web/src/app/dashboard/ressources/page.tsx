"use client";

import React from "react";

// Types
interface Resource {
    id: string;
    title: string;
    course: string;
    university: string;
    faculty: string;
    type: "pdf" | "docx" | "xlsx" | "pptx";
    downloads: number;
    date: string;
    size: string;
}

const resources: Resource[] = [
    {
        id: "1",
        title: "Cours d'Algèbre Linéaire S2",
        course: "ALGEBRE LINEAIRE",
        university: "Université Thomas Sankara",
        faculty: "Faculté des Sciences",
        type: "pdf",
        downloads: 234,
        date: "12 Jan 2026",
        size: "2.4 MB",
    },
    {
        id: "2",
        title: "TD Chimie Organique S1",
        course: "CHIMIE ORGANIQUE",
        university: "Université Thomas Sankara",
        faculty: "Faculté des Sciences",
        type: "pdf",
        downloads: 156,
        date: "10 Jan 2026",
        size: "1.8 MB",
    },
    {
        id: "3",
        title: "Examen Physique Quantique 2024",
        course: "PHYSIQUE QUANTIQUE",
        university: "Université Thomas Sankara",
        faculty: "Faculté des Sciences",
        type: "pdf",
        downloads: 89,
        date: "08 Jan 2026",
        size: "950 KB",
    },
    {
        id: "4",
        title: "Cours Histoire Contemporaine",
        course: "HISTOIRE CONTEMPORAINE",
        university: "Université Thomas Sankara",
        faculty: "Faculté des Lettres",
        type: "docx",
        downloads: 312,
        date: "05 Jan 2026",
        size: "1.2 MB",
    },
    {
        id: "5",
        title: "TD Macroéconomie L2",
        course: "MACROECONOMIE",
        university: "Université Thomas Sankara",
        faculty: "Faculté d'Economie",
        type: "xlsx",
        downloads: 178,
        date: "03 Jan 2026",
        size: "450 KB",
    },
    {
        id: "6",
        title: "Presentation Biologie Cellulaire",
        course: "BIOLOGIE CELLULAIRE",
        university: "Université Thomas Sankara",
        faculty: "Faculté des Sciences",
        type: "pptx",
        downloads: 267,
        date: "01 Jan 2026",
        size: "5.6 MB",
    },
];

const fileTypeIcons: Record<string, React.ReactNode> = {
    pdf: (
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="text-red-600 font-bold text-xs">PDF</span>
        </div>
    ),
    docx: (
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xs">DOC</span>
        </div>
    ),
    xlsx: (
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 font-bold text-xs">XLS</span>
        </div>
    ),
    pptx: (
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-orange-600 font-bold text-xs">PPT</span>
        </div>
    ),
};

export default function RessourcesPage() {
    return (
        <div>
            {/* Resources List */}
            <div className="space-y-4">
                {resources.map((resource) => (
                    <div
                        key={resource.id}
                        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-kora-gold/30 transition-all duration-200"
                    >
                        <div className="flex items-center gap-4">
                            {/* File Type Icon */}
                            {fileTypeIcons[resource.type]}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-gray-900 font-medium truncate">
                                    {resource.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                        {resource.course}
                                    </span>
                                    <span>•</span>
                                    <span>{resource.university}</span>
                                    <span>•</span>
                                    <span>{resource.faculty}</span>
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span>{resource.downloads}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{resource.date}</span>
                                </div>
                                <span className="text-xs">{resource.size}</span>
                            </div>

                            {/* Download Button */}
                            <button className="px-4 py-2 bg-kora-gold text-white font-medium text-sm rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Télécharger
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
                <button className="px-6 py-2.5 border border-gray-300 text-gray-600 font-medium rounded-lg hover:border-kora-gold hover:text-kora-gold transition-colors">
                    Charger plus de ressources
                </button>
            </div>
        </div>
    );
}
