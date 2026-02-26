"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Determine active nav item
    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen flex">
            {/* Mobile Header - Visible only on small screens */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1E1E1E] flex items-center px-4 z-40">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-white p-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="flex items-center ml-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L8 8H10V16H8L12 22L16 16H14V8H16L12 2Z" fill="#C58B2B" />
                    </svg>
                    <span className="text-white font-bold text-xl tracking-wider ml-2">KORA</span>
                </div>
            </header>

            {/* Sidebar Overlay - Mobile */}
            {sidebarOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar - Charcoal/Anthracite */}
            <aside className={`
                w-64 bg-[#1E1E1E] flex flex-col fixed h-full z-50
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            }`}>
                {/* Logo - Hidden on mobile, visible on large screens */}
                <div className="p-6 hidden lg:block">
                    <div className="flex flex-col items-center">
                        {/* Stylized K icon above the O */}
                        <div className="mb-2">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L8 8H10V16H8L12 22L16 16H14V8H16L12 2Z" fill="#C58B2B" />
                            </svg>
                        </div>
                        <span className="text-white font-bold text-2xl tracking-wider">KORA</span>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="px-6 py-4 border-t border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C58B2B] flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">Admin</p>
                            <p className="text-gray-400 text-xs">Administrateur</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                    <div className="space-y-2">
                        {/* Tableau de bord - Active with gradient */}
                        <Link
                            href="/dashboard"
                            onClick={closeSidebar}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === "/dashboard"
                                ? "bg-gradient-to-r from-[#C58B2B] to-[#D4A03B] text-white"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span className="font-medium truncate">Tableau de bord</span>
                        </Link>

                        {/* Filières */}
                        <Link
                            href="/dashboard/filieres"
                            onClick={closeSidebar}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname.includes("filieres")
                                ? "bg-gradient-to-r from-[#C58B2B] to-[#D4A03B] text-white"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="font-medium truncate">Filières</span>
                        </Link>

                        {/* Niveaux */}
                        <Link
                            href="/dashboard/niveaux"
                            onClick={closeSidebar}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname.includes("niveaux")
                                ? "bg-gradient-to-r from-[#C58B2B] to-[#D4A03B] text-white"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="font-medium truncate">Niveaux</span>
                        </Link>

                        {/* Matières */}
                        <Link
                            href="/dashboard/matieres"
                            onClick={closeSidebar}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname.includes("matieres")
                                ? "bg-gradient-to-r from-[#C58B2B] to-[#D4A03B] text-white"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="font-medium truncate">Matières</span>
                        </Link>

                        {/* Ressources */}
                        <Link
                            href="/dashboard/ressources"
                            onClick={closeSidebar}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname.includes("ressources")
                                ? "bg-gradient-to-r from-[#C58B2B] to-[#D4A03B] text-white"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="font-medium truncate">Ressources</span>
                        </Link>
                    </div>
                </nav>

                {/* Logout - Bottom */}
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium truncate">Se déconnecter</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
                {children}
            </main>
        </div>
    );
}
