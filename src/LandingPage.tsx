import { useNavigate } from "react-router-dom";
import "./style/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="landing-nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>
          <span className="landing-nav-brand">CANCER IA</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features">Fonctionnalités</a>
          <a href="#about">À propos</a>
          <a href="#contact">Contact</a>
          <button className="landing-nav-btn" onClick={() => navigate("/login")}>
            Se connecter
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div className="landing-hero-text">
          <div className="landing-badge">
            <span className="landing-badge-dot"></span>
            Powered by Intelligence Artificielle
          </div>
          <h1>Diagnostic mammaire<br />assisté par l'IA</h1>
          <p>Une plateforme conçue pour les radiologues et médecins spécialistes. Analysez les examens mammaires, calculez le score BI-RADS et générez des rapports médicaux en quelques clics.</p>
          <div className="landing-hero-btns">
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Accéder à la plateforme
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})}>
              En savoir plus
            </button>
          </div>
        </div>

        <div className="landing-hero-visual">
          <div className="landing-hero-card main-card">
            <p className="card-label">Score BI-RADS</p>
            <div className="card-score-row">
              <span className="card-score">ACR 3</span>
              <span className="card-badge-blue">Surveillance</span>
            </div>
            <p className="card-sub">Probabilité malignité : 2%</p>
          </div>
          <div className="landing-hero-cards-row">
            <div className="landing-hero-card small-card">
              <p className="card-label">Densité mammaire</p>
              <p className="card-value">Type B</p>
            </div>
            <div className="landing-hero-card small-card">
              <p className="card-label">Conduite à tenir</p>
              <p className="card-value">Biopsie</p>
            </div>
          </div>
          <div className="landing-hero-card dark-card">
            <div className="dark-card-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <div>
              <p className="dark-card-sub">Rapport généré automatiquement</p>
              <p className="dark-card-title">Examen du 14/04/2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="landing-stats">
        <div className="landing-stats-grid">
          <div className="stat-item">
            <p className="stat-number">98%</p>
            <p className="stat-label">Précision de l'analyse IA</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">5,000+</p>
            <p className="stat-label">Examens analysés</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">200+</p>
            <p className="stat-label">Médecins utilisateurs</p>
          </div>
          <div className="stat-item">
            <p className="stat-number">3 min</p>
            <p className="stat-label">Temps moyen par analyse</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-features" id="features">
        <div className="landing-section-header">
          <h2>Tout ce dont vous avez besoin</h2>
          <p>Une suite complète d'outils pour le diagnostic du cancer du sein</p>
        </div>
        <div className="landing-features-grid">
          {[
            { icon: "👥", title: "Gestion des patients", desc: "Centralisez les dossiers patients, consultez l'historique des examens et suivez l'évolution des analyses." },
            { icon: "📋", title: "Saisie des examens", desc: "Formulaires structurés pour la mammographie et l'échographie avec calcul automatique du score BI-RADS." },
            { icon: "🤖", title: "Analyse IA", desc: "Intelligence artificielle pour estimer le score BI-RADS, la probabilité de malignité et la conduite à tenir." },
            { icon: "📄", title: "Rapports automatiques", desc: "Génération automatique de comptes rendus médicaux structurés et exportables en PDF." },
            { icon: "🔒", title: "Accès sécurisé", desc: "Authentification sécurisée avec gestion des rôles. Chaque médecin accède uniquement à ses données." },
            { icon: "📈", title: "Historique & suivi", desc: "Consultez l'historique complet des examens et suivez l'évolution des patients dans le temps." },
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Prêt à commencer ?</h2>
        <p>Rejoignez les médecins qui font confiance à Cancer IA</p>
        <button className="btn-white" onClick={() => navigate("/login")}>
          Accéder à la plateforme
        </button>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-logo">
          <div className="landing-nav-icon small">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>
          <span>Cancer IA — Plateforme médicale</span>
        </div>
        <p>Réservé aux professionnels de santé — 2026</p>
      </footer>

    </div>
  );
};

export default LandingPage;