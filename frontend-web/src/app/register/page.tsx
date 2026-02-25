"use client";

import Link from "next/link";
import { useState } from "react";

type Step = 1 | 2;

export default function RegisterPage() {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [showPassword, setShowPassword] = useState(false);

    const steps = [
        { number: 1, label: "Informations" },
        { number: 2, label: "Sécurité" },
    ];

    const nextStep = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentStep < 2) {
            setCurrentStep((prev) => (prev + 1) as Step);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step);
        }
    };

    return (
        <div className="min-h-screen bg-kora-dark flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center bg-white justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <img className="w-[150px] h-[50px]" src="/kora-logo.png" alt="Logo de Kora" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
                    <p className="text-gray-400 mb-8">
                        Espace Administration Universitaire
                    </p>

                    {/* Stepper */}
                    <div className="flex items-center justify-between mb-8">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep > step.number
                                            ? "bg-kora-gold text-kora-dark"
                                            : currentStep === step.number
                                                ? "bg-kora-gold text-kora-dark ring-4 ring-kora-gold/30"
                                                : "bg-white/10 text-gray-400"
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
                                    <span className={`text-xs mt-2 ${currentStep >= step.number ? "text-white" : "text-gray-500"}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-20 h-0.5 mx-2 ${currentStep > step.number ? "bg-kora-gold" : "bg-white/10"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <form className="space-y-5">
                        {/* Step 1: Personal Info */}
                        {currentStep === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                                            Prénom
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            placeholder="John"
                                            className="w-full px-4 py-3 bg-white/5 border border-black/10 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-kora-gold focus:border-transparent focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            placeholder="Doe"
                                            className="w-full px-4 py-3 bg-white/5 border border-black/10 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-kora-gold focus:border-transparent focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email professionnel
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="john.doe@university.edu"
                                        className="w-full px-4 py-3 bg-white/5 border border-black/10 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-kora-gold focus:border-transparent focus:outline-none transition-all"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Utilisez votre email professionnel universitaire
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        placeholder="+226 XX XX XX XX"
                                        className="w-full px-4 py-3 bg-white/5 border border-black/10 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-kora-gold focus:border-transparent focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Security */}
                        {currentStep === 2 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 bg-white/5 border border-black/10 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-kora-gold focus:border-transparent focus:outline-none transition-all pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirmer le mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-white/5 border border-black/10 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-kora-gold focus:border-transparent focus:outline-none transition-all"
                                    />
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 mt-1 bg-white/5 border-black/20 rounded focus:ring-kora-gold focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-gray-400">
                                        J'accepte les{" "}
                                        <Link href="/terms" className="text-kora-gold hover:text-yellow-400 transition-colors">
                                            conditions d'utilisation
                                        </Link>{" "}
                                        et la{" "}
                                        <Link href="/privacy" className="text-kora-gold hover:text-yellow-400 transition-colors">
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
                                    className="flex-1 py-3 border border-black/20 text-black font-medium rounded-lg hover:bg-black/5 transition-colors"
                                >
                                    Retour
                                </button>
                            )}
                            {currentStep < 2 ? (
                                <button
                                    type="button"
                                    onClick={(e) => nextStep(e)}
                                    className={`${currentStep === 1 ? "w-full" : "flex-1"} py-3 bg-kora-gold text-kora-dark font-semibold rounded-lg hover:bg-yellow-600 transition-colors`}
                                >
                                    Suivant
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-kora-gold text-kora-dark font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                                >
                                    Créer mon compte
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-gray-400">
                        Déjà un compte ?{" "}
                        <Link href="/login" className="text-kora-gold hover:text-yellow-400 font-medium transition-colors">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image/Pattern */}
            <div className="hidden lg:flex flex-1 justify-center items-center bg-gradient-to-br from-kora-gold/20 to-kora-dark relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-kora-gold rounded-full"></div>
                    <div className="absolute top-1/2 left-1/3 w-96 h-96 border border-kora-gold rounded-full"></div>
                    <div className="absolute bottom-1/4 left-1/2 w-64 h-64 border border-kora-gold rounded-full"></div>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-12">
                     <div className="flex bg-white p-2 items-center gap-2 mb-8">
                        <img className="w-[150px] h-[50px]" src="/kora-logo.png" alt="Logo de Kora" />
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
