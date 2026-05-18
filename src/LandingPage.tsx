import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #EEF2F7 0%, #E6EDF8 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "2rem",
      position: "relative",
      overflow: "hidden"
    }}>

      {/* Formes décoratives */}
      <div style={{
        position: "absolute", top: "-80px", right: "-80px",
        width: "320px", height: "320px",
        borderRadius: "50%",
        background: "rgba(27,43,107,0.06)",
        pointerEvents: "none"
      }}/>
      <div style={{
        position: "absolute", bottom: "-60px", left: "-60px",
        width: "240px", height: "240px",
        borderRadius: "50%",
        background: "rgba(27,43,107,0.05)",
        pointerEvents: "none"
      }}/>
      <div style={{
        position: "absolute", top: "40%", left: "5%",
        width: "80px", height: "80px",
        borderRadius: "50%",
        background: "rgba(74,144,217,0.08)",
        pointerEvents: "none"
      }}/>
      <div style={{
        position: "absolute", top: "20%", right: "10%",
        width: "50px", height: "50px",
        borderRadius: "50%",
        background: "rgba(74,144,217,0.1)",
        pointerEvents: "none"
      }}/>

      {/* Card principale */}
      <div style={{
        background: "white",
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 8px 40px rgba(27,43,107,0.1)",
        padding: "3rem 3.5rem",
        textAlign: "center",
        maxWidth: "580px",
        width: "100%",
        animation: "fadeInUp 0.5s ease both",
        position: "relative",
        zIndex: 1
      }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "#EEF2F7",
          border: "1px solid #d1dae8",
          borderRadius: "20px",
          padding: "5px 14px",
          marginBottom: "1.75rem"
        }}>
          <div style={{
            width: "7px", height: "7px",
            borderRadius: "50%",
            background: "#1B2B6B"
          }}/>
          <span style={{ fontSize: "12px", color: "#1B2B6B", fontWeight: "600", letterSpacing: "0.3px" }}>
            Plateforme médicale sécurisée
          </span>
        </div>

        {/* Logo image + Titre */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: "12px",
          marginBottom: "1.25rem"
        }}>
          <img
            src="/logo-octobre-rose.png"
            alt="Octobre Rose"
            style={{
              width: "52px",
              height: "52px",
              objectFit: "contain",
              borderRadius: "14px"
            }}
          />
          <h1 style={{
            fontSize: "34px",
            fontWeight: "700",
            color: "#1B2B6B",
            margin: 0,
            letterSpacing: "-0.5px"
          }}>
            Breast AI Report
          </h1>
        </div>

        {/* Séparateur */}
        <div style={{
          width: "48px", height: "3px",
          background: "linear-gradient(90deg, #1B2B6B, #4A90D9)",
          borderRadius: "2px",
          margin: "0 auto 1.5rem"
        }}/>

        {/* Sous-titre */}
        <h2 style={{
          fontSize: "17px",
          fontWeight: "600",
          color: "#1B2B6B",
          margin: "0 0 1rem",
          lineHeight: "1.5"
        }}>
          Compte Rendu écho-mammographique<br />Structuré assisté par l'IA
        </h2>

        {/* Description */}
        <p style={{
          fontSize: "14px",
          color: "#64748b",
          lineHeight: "1.75",
          margin: "0 0 2rem"
        }}>
          Une plateforme pour les radiologues, permettant de rédiger des comptes rendus
          structurés selon le lexique BI-RADS 2013, avec calcul du score BI-RADS et des
          recommandations pour la conduite à tenir.
        </p>

        {/* Features pills */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          gap: "8px", justifyContent: "center",
          marginBottom: "2rem"
        }}>
          {["BI-RADS 2013", "Mammographie", "Échographie", "Compte rendu PDF"].map((tag) => (
            <span key={tag} style={{
              background: "#EEF2F7",
              border: "1px solid #d1dae8",
              borderRadius: "20px",
              padding: "4px 12px",
              fontSize: "12px",
              color: "#1B2B6B",
              fontWeight: "500"
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Bouton */}
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "14px 48px",
            background: "#1B2B6B",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
            boxShadow: "0 4px 16px rgba(27,43,107,0.3)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#243d8f";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,43,107,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1B2B6B";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(27,43,107,0.3)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          Se connecter
        </button>

        {/* Footer card */}
        <p style={{
          fontSize: "11px",
          color: "#94a3b8",
          margin: "1.5rem 0 0"
        }}>
          Réservé aux professionnels de santé — 2026
        </p>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          div[style*="padding: 3rem"] { padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;