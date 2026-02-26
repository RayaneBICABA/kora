"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        nom: "",
        email: "",
        sujet: "",
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate form submission
        setTimeout(() => {
            setSuccess(true);
            setIsLoading(false);
            setFormData({ nom: "", email: "", sujet: "", message: "" });
        }, 1000);
    };

    const year = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 w-[170px] h-[50px]">
                        <Link href="/">
                            <img className="w-full h-full" src="kora-logo.png" alt="Logo de kora" />
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-gray-800 hover:text-[#C58B2B] transition-colors">
                            Accueil
                        </Link>
                        <Link href="/login" className="text-gray-800 hover:text-[#C58B2B] transition-colors">
                            Ressources
                        </Link>
                        <Link href="/about" className="text-gray-800 hover:text-[#C58B2B] transition-colors">
                            À propos
                        </Link>
                        <Link href="/contact" className="text-[#C58B2B] font-medium transition-colors">
                            Contact
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-gray-800 hover:text-[#C58B2B] transition-colors"
                        >
                            Connexion
                        </Link>
                        <Link
                            href="/register"
                            className="bg-[#C58B2B] text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                        >
                            Inscription
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    {/* Title Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
                            Nous <span className="text-[#C58B2B]">contacter</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Vous avez une question ou un commentaire ? N'hésitez pas à nous envoyer un message.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">
                                Informations de contact
                            </h2>

                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#C58B2B]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#C58B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1E1E1E] mb-1">Email</h3>
                                        <p className="text-gray-500">contact@kora-platform.com</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#C58B2B]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#C58B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1E1E1E] mb-1">Téléphone</h3>
                                        <p className="text-gray-500">+226 07 92 60 54</p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#C58B2B]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#C58B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1E1E1E] mb-1">Adresse</h3>
                                        <p className="text-gray-500">Koudougou, Burkina Faso</p>
                                    </div>
                                </div>

                        
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-gray-50 rounded-2xl p-8">
                            {success ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">Message envoyé !</h3>
                                    <p className="text-gray-500 mb-4">
                                        Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
                                    </p>
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="text-[#C58B2B] hover:text-yellow-600 font-medium"
                                    >
                                        Envoyer un autre message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom complet
                                        </label>
                                        <input
                                            type="text"
                                            name="nom"
                                            id="nom"
                                            required
                                            value={formData.nom}
                                            onChange={handleChange}
                                            placeholder="Votre nom"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="votre@email.com"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-2">
                                            Sujet
                                        </label>
                                        <select
                                            name="sujet"
                                            id="sujet"
                                            required
                                            value={formData.sujet}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all"
                                        >
                                            <option value="">Sélectionnez un sujet</option>
                                            <option value="question">Question générale</option>
                                            <option value="support">Support technique</option>
                                            <option value="partenariat">Partenariat</option>
                                            <option value="autre">Autre</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            id="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Votre message..."
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 bg-[#C58B2B] text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Envoi en cours..." : "Envoyer le message"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <img className="w-30 h-8" src="kora-logo.png" alt="Logo de kora" />
                        </div>
                        <p className="text-gray-500 text-sm">
                            © 2025 - {year} KORA. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
