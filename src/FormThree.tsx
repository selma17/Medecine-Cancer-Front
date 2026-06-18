import React from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "./steppper/Stepper";
import { useFormThreeLogic } from "./formThreeParts/useFormThreeLogic";
import MedicalReport from "./formThreeParts/MedicalReport";

const FormThree: React.FC = () => {
  const navigate = useNavigate();
  const {
    steps, conduiteIA, acrScore, loadingIA,
    acrDroit, acrGauche, recommandationDroit, recommandationGauche,
    scanData, showMedicalReport, openMedicalReport, closeMedicalReport,
  } = useFormThreeLogic(navigate);

  // ── Helpers couleur / label ──────────────────────────────────────────────
  const getAcrColor = (score: string) => {
    if (!score) return "#64748b";
    const n = parseInt(score[0]);
    if (n <= 2) return "#16a34a";
    if (n === 3) return "#f97316";
    if (n === 4) return "#e11d48";
    return "#7c2d12";
  };

  const getAcrLabel = (score: string) => {
    const map: { [k: string]: string } = {
      "1": "Normal",
      "2": "Probablement bénin",
      "3": "Surveillance recommandée",
      "4": "Très suspect",
      "4A": "Faible suspicion de malignité",
      "4B": "Suspicion intermédiaire",
      "4C": "Suspicion modérément élevée",
      "5": "Hautement suspect",
    };
    return map[score] || "Non défini";
  };

  const getConduiteIcon = (conduite: string) => {
    if (conduite?.toLowerCase().includes("surveillance"))
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    if (conduite?.toLowerCase().includes("biopsie"))
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
    if (conduite?.toLowerCase().includes("ablation"))
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
  };

  // ── Détermine si on a des résultats par sein ─────────────────────────────
  const hasPerBreast = !!(acrDroit || acrGauche);

  // Seins qui ont un score ACR (pas seulement ceux avec masses)
  const seinsActifs: string[] = [
    ...(acrDroit ? ["droit"] : []),
    ...(acrGauche ? ["gauche"] : []),
  ];


  // ── Carte sein : normal vs pathologique ─────────────────────────────────
  const isNormal = (score: string) => score === "1" || score === "2";

  const SeinCard: React.FC<{ label: string; acr: string; reco: string }> = ({ label, acr, reco }) => {
    const normal = isNormal(acr);
    return (
      <div className="sein-card">
        <div className="sein-card-header" style={{ background: normal ? "#16a34a" : getAcrColor(acr) }}>
          {label}
        </div>
        <div className="sein-card-body" style={{ background: normal ? "#f0fdf4" : undefined }}>
          {normal ? (
            <>
              <div className="sein-acr-circle" style={{ background: "#dcfce7", border: "1.5px dashed #86efac" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a", textAlign: "center", margin: "0 0 4px" }}>Normal</p>
              <p style={{ fontSize: "11px", color: "#64748b", textAlign: "center", margin: 0, fontStyle: "italic" }}>ACR {acr} — aucune anomalie</p>
            </>
          ) : (
            <>
              <div className="sein-acr-circle" style={{ background: getAcrColor(acr) }}>
                <span style={{ fontSize: "22px", fontWeight: "700", color: "white" }}>{acr}</span>
              </div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: getAcrColor(acr), textAlign: "center", margin: "0 0 6px" }}>
                {getAcrLabel(acr)}
              </p>
              {reco && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: getAcrColor(acr) }}>
                  {getConduiteIcon(reco)}
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>{reco}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .form3-page {
          min-height: 100vh;
          background: #EEF2F7;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-y: auto !important;
        }
        .form3-topbar {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.875rem 2rem;
          display: flex; align-items: center; gap: 1rem;
          position: sticky; top: 0; z-index: 10;
        }
        .form3-body {
          max-width: 680px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .form3-stepper-card {
          background: white; border-radius: 12px;
          border: 1px solid #e2e8f0; padding: 1.25rem 2rem;
          margin-bottom: 1.5rem;
        }
        .form3-card {
          background: white; border-radius: 16px;
          border: 1px solid #e2e8f0; overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .form3-card-header {
          background: #1B2B6B; padding: 1.25rem 1.75rem;
          display: flex; align-items: center; gap: 12px;
        }
        .form3-card-body { padding: 1.75rem; }
        .form3-loading {
          text-align: center; padding: 3rem 2rem;
        }
        .form3-loading-dots {
          display: flex; justify-content: center; gap: 8px; margin-bottom: 1.5rem;
        }
        .form3-loading-dot {
          width: 12px; height: 12px; background: #1B2B6B;
          border-radius: 50%; animation: bounce 1.4s infinite ease-in-out;
        }
        .form3-loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .form3-loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sein-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
          margin-bottom: 1.5rem;
        }
        .sein-grid-single {
          display: grid; grid-template-columns: minmax(0, 360px); gap: 12px;
          margin-bottom: 1.5rem; justify-content: center;
        }
        .sein-card {
          border-radius: 12px; border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .sein-card-header {
          padding: 8px 12px; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
          color: white; text-align: center;
        }
        .sein-card-body { padding: 12px; background: #F8FAFC; }
        .sein-acr-circle {
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 8px; flex-shrink: 0;
        }
        .sein-reco {
          font-size: 11px; color: #475569; text-align: center;
          margin-top: 6px; line-height: 1.4;
        }
        .global-acr-row {
          display: flex; align-items: center; gap: 1.25rem;
          background: #F8FAFC; border-radius: 12px;
          padding: 1.25rem; border: 1px solid #e2e8f0;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 480px) {
          .sein-grid { grid-template-columns: 1fr; }
          .form3-body { padding: 1rem; }
        }
      `}</style>

      <div className="form3-page">
        {/* Topbar */}
        <div className="form3-topbar">
          <button
            onClick={() => navigate(-1)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "14px", fontFamily: "inherit", padding: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <div style={{ width: "1px", height: "20px", background: "#e2e8f0" }}/>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src="/logo-octobre-rose.png" alt="Logo" style={{ width: "28px", height: "28px", objectFit: "contain", borderRadius: "6px" }}/>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#1B2B6B" }}>Breast AI Report</span>
          </div>
        </div>

        <div className="form3-body">
          {/* Stepper */}
          <div className="form3-stepper-card">
            <Stepper steps={steps} currentStep={2} />
          </div>

          {/* Main card */}
          <div className="form3-card">
            <div className="form3-card-header">
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <div>
                <h2 style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0 }}>Conclusion IA</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: 0 }}>Analyse automatique des résultats</p>
              </div>
            </div>

            <div className="form3-card-body">
              {loadingIA ? (
                <div className="form3-loading">
                  <div className="form3-loading-dots">
                    <div className="form3-loading-dot"/>
                    <div className="form3-loading-dot"/>
                    <div className="form3-loading-dot"/>
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1B2B6B", margin: "0 0 8px" }}>Analyse IA en cours...</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Notre IA analyse vos résultats pour fournir une conclusion précise.</p>
                </div>
              ) : (
                <div style={{ animation: "fadeInUp 0.4s ease both" }}>

                  {/* ── Résultats par sein (si disponibles) ── */}
                  {hasPerBreast ? (
                    <>
                      <p style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>
                        {seinsActifs.length === 1 ? "Résultat — Sein concerné" : "Résultats par sein"}
                      </p>

                      <div className={seinsActifs.length === 1 ? "sein-grid-single" : "sein-grid"}>
                        {seinsActifs.includes("droit") && (
                          <SeinCard label="Sein Droit" acr={acrDroit} reco={recommandationDroit} />
                        )}
                        {seinsActifs.includes("gauche") && (
                          <SeinCard label="Sein Gauche" acr={acrGauche} reco={recommandationGauche} />
                        )}
                      </div>
                    </>
                  ) : (
                    /* ── Fallback : affichage global uniquement ── */
                    <>
                      <p style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>
                        Résultat ACR
                      </p>
                      <div className="global-acr-row">
                        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: getAcrColor(acrScore), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: "30px", fontWeight: "700", color: "white" }}>{acrScore || "—"}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Score BI-RADS / ACR</p>
                          <p style={{ fontSize: "18px", fontWeight: "700", color: getAcrColor(acrScore), margin: "0 0 6px" }}>
                            {getAcrLabel(acrScore)}
                          </p>
                        </div>
                      </div>

                      <p style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>
                        Action Recommandée
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#F0FDF4", borderRadius: "12px", padding: "1.25rem", border: "1px solid #BBF7D0", marginBottom: "1.5rem" }}>
                        <div style={{ color: "#15803d", flexShrink: 0 }}>{getConduiteIcon(conduiteIA)}</div>
                        <p style={{ fontSize: "16px", fontWeight: "600", color: "#15803d", margin: 0 }}>{conduiteIA || "—"}</p>
                      </div>
                    </>
                  )}

                  {/* Bouton voir rapport */}
                  <button
                    onClick={openMedicalReport}
                    disabled={!scanData}
                    style={{ width: "100%", padding: "12px", background: "#EEF2F7", border: "2px dashed #B5D4F4", borderRadius: "10px", color: "#1B2B6B", fontSize: "14px", fontWeight: "600", cursor: scanData ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "inherit", transition: "all 0.2s", opacity: scanData ? 1 : 0.5 }}
                    onMouseEnter={(e) => { if (scanData) e.currentTarget.style.background = "#E6F1FB"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#EEF2F7"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    Voir le compte rendu médical
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {!loadingIA && (
              <div style={{ padding: "1.25rem 1.75rem", borderTop: "1px solid #e2e8f0" }}>
                <button
                  onClick={() => navigate("/dashboard")}
                  style={{ width: "100%", padding: "13px", background: "#1B2B6B", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#243d8f"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#1B2B6B"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Enregistrer et terminer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {scanData && (
        <MedicalReport
          isOpen={showMedicalReport}
          onClose={closeMedicalReport}
          scanData={scanData}
        />
      )}
    </>
  );
};

export default FormThree;