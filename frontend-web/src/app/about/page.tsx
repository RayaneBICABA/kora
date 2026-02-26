import Link from "next/link";

export default function AboutPage() {
    const year = new Date().getFullYear();
  return (

    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 w-[170px] h-[50px]">
            <Link href="/">
              <img className="w-full h-full" src="kora-logo.png" alt="Logo de kora"/>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-800 hover:text-[#C58B2B] transition-colors">
              Accueil
            </Link>
            <Link href="/login" className="text-gray-800 hover:text-[#C58B2B] transition-colors">
              Ressoures
            </Link>
            <Link href="/about" className="text-[#C58B2B] font-medium transition-colors">
              À propos
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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-6">
              À propos de <span className="text-[#C58B2B]">KORA</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Votre plateforme de centralisation des ressources académiques universitaires
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E1E1E] mb-4">
                  Notre Mission
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-6">
                  KORA est une plateforme conçue pour centraliser et partager les ressources académiques 
                  au sein des universités africaines. Nous croyons que l'accès au savoir ne devrait 
                  pas être un obstacle pour les étudiants.
                </p>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Notre objectif est de créer une communauté où les étudiants peuvent partager leurs 
                  cours, examens, TD et corrigés pour faciliter l'apprentissage collectif.
                </p>
              </div>
              <div className="bg-[#1E1E1E] rounded-2xl p-8">
                <div className="flex items-center justify-center h-48">
                  <svg className="w-32 h-32 text-[#C58B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E1E1E] text-center mb-12">
              Ce que nous offrons
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-[#C58B2B]/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#C58B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">
                  Cours & Notes
                </h3>
                <p className="text-gray-500">
                  Accédez à des milliers de cours et notes partagés par les étudiants de votre université.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-[#C58B2B]/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#C58B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">
                  Examens & Corrigés
                </h3>
                <p className="text-gray-500">
                  Préparez-vous efficacement avec les examens des années précédentes et leurs corrigés.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-[#C58B2B]/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#C58B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">
                  Communauté
                </h3>
                <p className="text-gray-500">
                  Rejoignez une communauté active d'étudiants et partagez vos connaissances.
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-[#1E1E1E] rounded-2xl p-8 md:p-12 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#C58B2B] mb-2">10+</div>
                <div className="text-gray-400">Universités</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#C58B2B] mb-2">1000+</div>
                <div className="text-gray-400">Ressources</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#C58B2B] mb-2">500+</div>
                <div className="text-gray-400">Filières</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#C58B2B] mb-2">5000+</div>
                <div className="text-gray-400">Étudiants</div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E1E1E] mb-6">
              Vous avez des questions ?
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
              N'hésitez pas à nous contacter pour toute question concernant la plateforme ou pour signaler un problème.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-[#C58B2B] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-600 transition-colors"
              >
                Créer un compte
              </Link>
              <Link
                href="/login"
                className="border border-[#C58B2B] text-[#C58B2B] px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#C58B2B] hover:text-white transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </section>
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
