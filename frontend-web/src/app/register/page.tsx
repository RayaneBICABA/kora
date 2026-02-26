"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

type Step = 1 | 2;

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Form data stored in state
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        universite: "",
    });

    const steps = [
        { number: 1, label: "Informations" },
        { number: 2, label: "Sécurité" },
    ];

    // Update form data when inputs change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const nextStep = (e: React.MouseEvent) => {
        e.preventDefault();

        // Validate step 1 fields before moving to step 2
        if (!formData.nom || !formData.prenom || !formData.email || !formData.universite) {
            setError("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setError("");
        if (currentStep < 2) {
            setCurrentStep((prev) => (prev + 1) as Step);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            setIsLoading(false);
            return;
        }

        try {
            // Register as admin for university administration
            await register({
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                motDePasse: formData.password,
                role: "admin",
                universite: formData.universite,
            });
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
                    {/* Logo */}
                     <div className="flex items-center gap-2 w-[170px] h-[50px] mb-8">
                        <img className="w-full h-full" src="kora-logo.png" alt="Logo de kora"/>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">Créer un compte</h1>
                    <p className="text-gray-500 mb-8">
                        Espace Administration Universitaire
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Stepper */}
                    <div className="flex items-center justify-between mb-8">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep > step.number
                                            ? "bg-[#C58B2B] text-white"
                                            : currentStep === step.number
                                                ? "bg-[#C58B2B] text-white ring-4 ring-[#C58B2B]/30"
                                                : "bg-gray-100 text-gray-400"
                                            }`}
                                    >
                                        {currentStep > step.number ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            step.number
                                        )}
                                    </div>
                                    <span className={`text-xs mt-2 ${currentStep >= step.number ? "text-gray-900" : "text-gray-400"}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-20 h-0.5 mx-2 ${currentStep > step.number ? "bg-[#C58B2B]" : "bg-gray-200"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Step 1: Personal Info */}
                        {currentStep === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                                            Prénom *
                                        </label>
                                        <input
                                            type="text"
                                            name="prenom"
                                            id="prenom"
                                            required
                                            value={formData.prenom}
                                            onChange={handleChange}
                                            placeholder="Yohanne"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom *
                                        </label>
                                        <input
                                            type="text"
                                            name="nom"
                                            id="nom"
                                            required
                                            value={formData.nom}
                                            onChange={handleChange}
                                            placeholder="Nana"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email professionnel *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="nanayoha@university.edu"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Utilisez votre email professionnel universitaire
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+226 XX XX XX XX"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="universite" className="block text-sm font-medium text-gray-700 mb-2">
                                        Université (votre institution) *
                                    </label>
                                    <input
                                        type="text"
                                        name="universite"
                                        id="universite"
                                        required
                                        value={formData.universite}
                                        onChange={handleChange}
                                        placeholder="Nom de l'université ( En toute lettre )"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Entrez le nom de votre université. Si elle existe déjà, elle sera associée à votre compte.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Security */}
                        {currentStep === 2 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Hidden fields from step 1 */}
                                <input type="hidden" name="nom" value={formData.nom} />
                                <input type="hidden" name="prenom" value={formData.prenom} />
                                <input type="hidden" name="email" value={formData.email} />
                                <input type="hidden" name="phone" value={formData.phone} />

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mot de passe *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            required
                                            minLength={6}
                                            value={formData.password}
                                            onChange={handleChange}
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

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmer le mot de passe *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        required
                                        minLength={6}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#C58B2B] focus:border-transparent focus:outline-none transition-all"
                                    />
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        required
                                        className="w-4 h-4 mt-1 bg-gray-50 border-gray-300 rounded focus:ring-[#C58B2B]"
                                    />
                                    <span className="text-sm text-gray-500">
                                        J'accepte les{" "}
                                        <Link href="/terms" className="text-[#C58B2B] hover:text-yellow-600 transition-colors">
                                            conditions d'utilisation
                                        </Link>{" "}
                                        et la{" "}
                                        <Link href="/privacy" className="text-[#C58B2B] hover:text-yellow-600 transition-colors">
                                            politique de confidentialité
                                        </Link>
                                    </span>
                                </label>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 pt-4">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Retour
                                </button>
                            )}
                            {currentStep < 2 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className={`${currentStep === 1 ? "w-full" : "flex-1"} py-3 bg-[#C58B2B] text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors`}
                                >
                                    Suivant
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-3 bg-[#C58B2B] text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Création..." : "Créer mon compte"}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-gray-500">
                        Déjà un compte ?{" "}
                        <Link href="/login" className="text-[#C58B2B] hover:text-yellow-600 font-medium transition-colors">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Background with Logo */}
            <div className="hidden lg:flex flex-1 bg-[#1E1E1E] relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-[#C58B2B] rounded-full"></div>
                    <div className="absolute top-1/2 left-1/3 w-96 h-96 border border-[#C58B2B] rounded-full"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-64 h-64 border border-[#C58B2B] rounded-full"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-12">
                    {/* KORA Logo from public folder */}
                    <div className="w-[170px] h-[50px] mb-8 p-2 bg-white rounded">
                        <img
                            src="/kora-logo.png"
                            alt="KORA Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Administration
                    </h2>
                    <p className="text-gray-400 max-w-md">
                        Gérez les ressources académiques de votre université. Uploadez des cours, examens et documents pour les étudiants.
                    </p>
                </div>
            </div>
        </div>
    );
}
