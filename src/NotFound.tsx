import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#EEF2F7", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ textAlign: "center", animation: "fadeInUp 0.4s ease both" }}>
        <div style={{ fontSize: "80px", fontWeight: "700", color: "#1B2B6B", lineHeight: 1 }}>404</div>
        <p style={{ fontSize: "20px", fontWeight: "600", color: "#1B2B6B", margin: "1rem 0 0.5rem" }}>Page introuvable</p>
        <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 2rem" }}>La page que vous cherchez n'existe pas.</p>
        <button onClick={() => navigate("/dashboard")}
          style={{ padding: "12px 28px", background: "#1B2B6B", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#243d8f"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#1B2B6B"}
        >
          Retour au dashboard
        </button>
      </div>
      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default NotFound;