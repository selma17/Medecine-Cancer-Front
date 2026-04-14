import React from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "./steppper/Stepper";
import { useStepFourLogic } from "./form-four/useStepFourLogic";

const FormFour: React.FC = () => {
  const navigate = useNavigate();
  const { steps, conclusionIA, conduiteATenir, acrType, loading, handleSubmit } = useStepFourLogic(navigate);

  const getConduiteStyle = (conduite: string) => {
    if (conduite.toLowerCase().includes("surveillance")) return { bg: "#F0FDF4", color: "#15803d", border: "#BBF7D0", icon: "👁️" };
    if (conduite.toLowerCase().includes("biopsie")) return { bg: "#FFF7ED", color: "#c2410c", border: "#FED7AA", icon: "🔬" };
    if (conduite.toLowerCase().includes("ablation")) return { bg: "#FFF1F2", color: "#be123c", border: "#FECDD3", icon: "⚕️" };
    if (conduite.toLowerCase().includes("traitement")) return { bg: "#EFF6FF", color: "#1d4ed8", border: "#BFDBFE", icon: "💊" };
    return { bg: "#F8FAFC", color: "#1B2B6B", border: "#e2e8f0", icon: "📋" };
  };

  const conduiteStyle = getConduiteStyle(conduiteATenir);

  return (
    <>
      <style>{`
        .form4-page {
          min-height: 100vh;
          background: #EEF2F7;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-y: auto !important;
        }
        .form4-topbar {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.875rem 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .form4-body {
          max-width: 720px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .form4-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .form4-card-header {
          background: #1B2B6B;
          padding: 1.25rem 1.75rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .form4-card-body { padding: 1.75rem; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) { .form4-body { max-width: 90%; } }
        @media (max-width: 768px) { .form4-body { padding: 1rem; max-width: 100%; } }
      `}</style>

      <div className="form4-page">
        {/* Topbar */}
        <div className="form4-topbar">
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "14px", fontFamily: "inherit", padding: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <div style={{ width: "1px", height: "20px", background: "#e2e8f0" }}/>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1B2B6B", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2C9 2 7 4 7 6.5c0 2 1.5 3.5 3 5L12 13l2-1.5c1.5-1.5 3-3 3-5C17 4 15 2 12 2z"/>
                <path d="M12 13l-4 6c-.5 1 0 2 1 2s1.5-.5 3-2l0 0c1.5 1.5 2 2 3 2s1.5-1 1-2l-4-6z"/>
              </svg>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#1B2B6B" }}>Cancer IA</span>
          </div>
        </div>

        <div className="form4-body">
          {/* Stepper */}
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.25rem 2rem", marginBottom: "1.5rem" }}>
            <Stepper steps={steps} currentStep={3} />
          </div>

          {loading ? (
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "3rem", textAlign: "center" }}>
              <div style={{ width: "40px", height: "40px", border: "3px solid #EEF2F7", borderTop: "3px solid #1B2B6B", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}/>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Chargement des résultats...</p>
            </div>
          ) : (
            <>
              {/* ACR Type card — seulement si ACR 4 */}
              {acrType && (
                <div className="form4-card" style={{ animation: "fadeInUp 0.4s ease both" }}>
                  <div className="form4-card-header">
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <div>
                      <h2 style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0 }}>Classification ACR</h2>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: 0 }}>Résultat de l'analyse</p>
                    </div>
                  </div>
                  <div className="form4-card-body">
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <div style={{ flex: 1, background: "#FFF1F2", borderRadius: "12px", padding: "1.25rem", textAlign: "center", border: "1px solid #FECDD3" }}>
                        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Score ACR</p>
                        <p style={{ fontSize: "36px", fontWeight: "700", color: "#e11d48", margin: 0 }}>4</p>
                      </div>
                      <div style={{ flex: 1, background: "#FFFBEB", borderRadius: "12px", padding: "1.25rem", textAlign: "center", border: "1px solid #FDE68A" }}>
                        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Type ACR</p>
                        <p style={{ fontSize: "36px", fontWeight: "700", color: "#92400E", margin: 0 }}>{acrType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Conclusion IA */}
              {conclusionIA && (
                <div className="form4-card" style={{ animation: "fadeInUp 0.4s ease 0.1s both" }}>
                  <div className="form4-card-header">
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    </div>
                    <div>
                      <h2 style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0 }}>Conclusion IA</h2>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: 0 }}>Analyse automatique</p>
                    </div>
                  </div>
                  <div className="form4-card-body">
                    <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "1.25rem", border: "1px solid #e2e8f0" }}>
                      <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.7", margin: 0 }}>{conclusionIA}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Conduite à tenir */}
              <div className="form4-card" style={{ animation: "fadeInUp 0.4s ease 0.2s both" }}>
                <div className="form4-card-header">
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  </div>
                  <div>
                    <h2 style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0 }}>Conduite à tenir</h2>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: 0 }}>Recommandation médicale</p>
                  </div>
                </div>
                <div className="form4-card-body">
                  {conduiteATenir ? (
                    <div style={{ background: conduiteStyle.bg, borderRadius: "12px", padding: "1.5rem", border: `1px solid ${conduiteStyle.border}`, display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "32px" }}>{conduiteStyle.icon}</span>
                      <div>
                        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Action recommandée</p>
                        <p style={{ fontSize: "18px", fontWeight: "700", color: conduiteStyle.color, margin: 0 }}>{conduiteATenir}</p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: "13px", color: "#64748b" }}>Aucune conduite disponible.</p>
                  )}
                </div>
              </div>

              {/* Info box */}
              <div style={{ background: "#E6F1FB", borderRadius: "12px", padding: "1.25rem", border: "1px solid #B5D4F4", display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", animation: "fadeInUp 0.4s ease 0.3s both" }}>
                <div style={{ width: "36px", height: "36px", background: "#1B2B6B", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <p style={{ fontSize: "13px", color: "#185FA5", margin: 0 }}>
                  Cette analyse est générée par intelligence artificielle et doit être validée par un médecin radiologue qualifié.
                </p>
              </div>

              {/* Submit */}
              <button onClick={handleSubmit}
                style={{ width: "100%", padding: "14px", background: "#1B2B6B", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.2s", animation: "fadeInUp 0.4s ease 0.4s both" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#243d8f"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#1B2B6B"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Terminer et enregistrer
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FormFour;