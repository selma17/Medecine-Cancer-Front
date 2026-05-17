import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#EEF2F7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "2rem"
    }}>
      <div style={{
        textAlign: "center",
        maxWidth: "640px",
        animation: "fadeInUp 0.5s ease both"
      }}>

        {/* Logo + Titre */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "2rem" }}>
          <div style={{
            width: "48px", height: "48px",
            borderRadius: "12px",
            background: "#1B2B6B",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2C9 2 7 4 7 6.5c0 2 1.5 3.5 3 5L12 13l2-1.5c1.5-1.5 3-3 3-5C17 4 15 2 12 2z"/>
              <path d="M12 13l-4 6c-.5 1 0 2 1 2s1.5-.5 3-2l0 0c1.5 1.5 2 2 3 2s1.5-1 1-2l-4-6z"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1B2B6B",
            margin: 0,
            letterSpacing: "-0.5px"
          }}>
            IRadiologie
          </h1>
        </div>

        {/* Sous-titre */}
        <h2 style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#1B2B6B",
          margin: "0 0 1rem",
          lineHeight: "1.4"
        }}>
          Compte Rendu écho-mammographique Structuré assisté par l'IA
        </h2>

        {/* Description */}
        <p style={{
          fontSize: "15px",
          color: "#64748b",
          lineHeight: "1.7",
          margin: "0 0 2.5rem"
        }}>
          Une plateforme pour les radiologues, permettant de rédiger des comptes rendus structurés
          selon le lexique BI-RADS 2013, avec calcul du score BI-RADS et des recommandations
          pour la conduite à tenir.
        </p>

        {/* Bouton */}
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "14px 40px",
            background: "#1B2B6B",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background 0.2s, transform 0.2s",
            boxShadow: "0 4px 16px rgba(27,43,107,0.3)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#243d8f";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1B2B6B";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Se connecter
        </button>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;