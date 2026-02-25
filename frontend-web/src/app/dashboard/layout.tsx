"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<"filieres" | "ressources">(
        pathname.includes("ressources") ? "ressources" : "filieres"
    );

    const navItems = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            label: "Accueil",
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            label: "Parcourir",
            href: "/dashboard/filieres",
            active: pathname.includes("filieres"),
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            ),
            label: "Télécharger",
            href: "/dashboard/ressources",
            active: pathname.includes("ressources"),
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            label: "Uploader",
            href: "/dashboard/upload",
            active: pathname.includes("upload"),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-20 bg-kora-dark flex flex-col items-center py-6 fixed h-full">
                {/* Logo */}
                <div className="mb-8">
                    <div className="w-12 h-12 bg-kora-gold rounded-xl flex items-center justify-center">
                        <span className="text-kora-dark font-bold text-2xl">K</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${item.active
                                    ? "bg-kora-gold text-kora-dark"
                                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                            title={item.label}
                        >
                            {item.icon}
                        </Link>
                    ))}
                </nav>

                {/* Profile */}
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-20">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {activeTab === "filieres" ? "Filières" : "Ressources"}
                        </h1>

                        {/* Tab Switcher */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab("filieres")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "filieres"
                                        ? "bg-white text-kora-dark shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                Filières
                            </button>
                            <button
                                onClick={() => setActiveTab("ressources")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "ressources"
                                        ? "bg-white text-kora-dark shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                Ressources
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-80 px-4 py-2 pl-10 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-kora-gold focus:outline-none text-gray-900 placeholder-gray-500"
                        />
                        <svg
                            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
