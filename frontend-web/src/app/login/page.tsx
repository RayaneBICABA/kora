"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const motDePasse = formData.get("password") as string;

        try {
            await login(email, motDePasse);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur s'est produite");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Back to Home Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C58B2B] transition-colors mb-6"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Retour à l'accueil</span>
                    </Link>

                    {/* Logo */}
                    <div className="flex items-center gap-2 w-[170px] h-[50px] mb-8">
                        <img className="w-full h-full" src="kora-logo.png" alt="Logo de kora" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">Bon retour !</h1>
                    <p className="text-gray-500 mb-8">
                        Connectez-vous pour accéder à vos ressources académiques
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email universitaires
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                placeholder="votre.email@university.edu"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>


                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-[#C58B2B] text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400">ou</span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <p className="mt-8 text-center text-gray-500">
                        Pas encore de compte ?{" "}
                        <Link href="/register" className="text-[#C58B2B] hover:text-yellow-600 font-medium transition-colors">
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Background with Logo */}
            <div className="hidden lg:flex flex-1 bg-[#1E1E1E] relative overflow-hidden justify-center items-center">
                {/* Decorative circles */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-[#C58B2B] rounded-full"></div>
                    <div className="absolute top-1/2 left-1/3 w-96 h-96 border border-[#C58B2B] rounded-full"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-64 h-64 border border-[#C58B2B] rounded-full"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-12">
                    {/* KORA Logo from public folder */}
                    <div className="w-[170px] h-[50px] bg-white mb-8 p-2 rounded">
                        <img
                            src="/kora-logo.png"
                            alt="KORA Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Plateforme Académique
                    </h2>
                    <p className="text-gray-400 max-w-md">
                        Accédez à des milliers de ressources académiques : cours, examens, TD et corrigés partagés par la communauté étudiante.
                    </p>
                </div>
            </div>
        </div>
    );
}
