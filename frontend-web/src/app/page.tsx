import Link from "next/link";

export default function Home() {
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
            <Link href="/" className="text-gray-800 hover:text-kora-gold transition-colors">
              Accueil
            </Link>
            <Link href="/login" className="text-gray-800 hover:text-kora-gold transition-colors">
              Ressources
            </Link>
            <Link href="/about" className="text-gray-800 hover:text-kora-gold transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-800 hover:text-kora-gold transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-800 hover:text-kora-gold transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="bg-kora-gold text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              Inscription
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
              Préservez et transmettez le{' '}
              <span className="text-kora-gold">savoir académique</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              KORA est la plateforme de centralisation des ressources académiques universitaires.
              Accédez aux cours, examens, corrigés et bien plus encore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-kora-gold text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-600 transition-colors"
              >
                Commencer maintenant
              </Link>
              <Link
                href="/resources"
                className="border border-white/20 px-8 py-3 rounded-lg font-semibold text-lg border-kora-gold text-kora-gold transition-colors"
              >
                Explorer les ressources
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
              Pourquoi utiliser KORA ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-kora-gold/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-kora-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Centralisation</h3>
                <p className="text-gray-400">
                  Tous vos cours, TD, examens et corrigés en un seul endroit.
                  Organisés par université, filière et niveau.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-kora-gold/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-kora-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Accessibilité</h3>
                <p className="text-gray-400">
                  Accédez à vos ressources même hors ligne.
                  Une expérience fluide même avec une faible connexion.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="w-12 h-12 bg-kora-gold/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-kora-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Communauté</h3>
                <p className="text-gray-400">
                  Partagez vos ressources avec la communauté étudiante.
                  Transmettez le savoir aux générations futures.
                </p>
              </div>
            </div>
          </div>
        </section>
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
