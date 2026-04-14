import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "./steppper/Stepper";
import { useFormThreeLogic } from "./formThreeParts/useFormThreeLogic";
import AcrResultSection from "./formThreeParts/acr-res-section";
import ConclusionSummary from "./formThreeParts/ConclusionSummary";
import ProgressIndicator from "./formThreeParts/ProgressIndicator";
import MedicalReport from "./formThreeParts/MedicalReport";

const FormThree: React.FC = () => {
  const navigate = useNavigate();
  const {
    steps, conclusionIA, conduiteIA, justificationIA,
    acrType, acrScore, loadingIA, handleSubmit,
    scanData, showMedicalReport, openMedicalReport, closeMedicalReport,
  } = useFormThreeLogic(navigate);

  const [, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const analysisSteps = ["Analyse des images", "Détection des anomalies", "Classification ACR", "Génération de la conclusion", "Finalisation"];

  useEffect(() => {
    if (loadingIA) {
      const steps = ["Analyse des images", "Détection des anomalies", "Classification ACR", "Génération de la conclusion", "Finalisation"];
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 12;
        });
        setCurrentAnalysisStep(prev => Math.min(prev + 1, steps.length - 1));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [loadingIA]);
  const getAcrColor = (score: string) => {
    const map: { [k: string]: string } = { "0": "#10b981", "1": "#3b82f6", "2": "#f59e0b", "3": "#f97316", "4": "#ef4444", "5": "#7c2d12" };
    return map[score] || "#64748b";
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
          display: flex;
          align-items: center;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .form3-body {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .form3-stepper-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 1.25rem 2rem;
          margin-bottom: 1.5rem;
        }
        .form3-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .form3-card-header {
          background: #1B2B6B;
          padding: 1.25rem 1.75rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .form3-card-body { padding: 1.75rem; }

        /* Loading */
        .form3-loading {
          text-align: center;
          padding: 3rem 2rem;
        }
        .form3-loading-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 1.5rem;
        }
        .form3-loading-dot {
          width: 12px; height: 12px;
          background: #1B2B6B;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }
        .form3-loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .form3-loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }

        /* ACR Score card */
        .form3-acr-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .form3-acr-score-display {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #F8FAFC;
          border-radius: 12px;
          margin-bottom: 1.25rem;
        }
        .form3-score-circle {
          width: 72px; height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        /* Report button */
        .form3-report-btn {
          width: 100%;
          padding: 14px;
          background: #EEF2F7;
          border: 2px dashed #B5D4F4;
          border-radius: 12px;
          color: #1B2B6B;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          transition: all 0.2s;
          margin-top: 1rem;
        }
        .form3-report-btn:hover {
          background: #E6F1FB;
          border-color: #4A90D9;
        }

        /* Submit */
        .form3-submit-btn {
          width: 100%;
          padding: 14px;
          background: #1B2B6B;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .form3-submit-btn:hover { background: #243d8f; }

        /* Override FormThree.css classes used by sub-components */
        .acr-result-section { padding: 0; }
        .acr-header { display: flex; align-items: center; gap: 8px; margin-bottom: 1rem; }
        .acr-title { font-size: 15px; font-weight: 600; color: #1B2B6B; margin: 0; }
        .acr-header-icon { font-size: 18px; }
        .acr-score-display { display: flex; align-items: center; gap: 1rem; }
        .acr-score-main { display: flex; align-items: center; gap: 12px; }
        .acr-score-icon { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .acr-score-info { display: flex; flex-direction: column; }
        .acr-label { font-size: 11px; color: #64748b; }
        .acr-value { font-size: 24px; font-weight: 700; }
        .acr-type-badge { display: flex; align-items: center; gap: 6px; background: #FFFBEB; padding: 6px 12px; border-radius: 20px; border: 1px solid #FDE68A; }
        .acr-type-label { font-size: 11px; color: #92400E; }
        .acr-type-value { font-size: 14px; font-weight: 600; color: #92400E; }
        .acr-loading { display: flex; align-items: center; gap: 8px; }
        .loading-spinner { width: 20px; height: 20px; border: 2px solid #EEF2F7; border-top: 2px solid #1B2B6B; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { font-size: 13px; color: #64748b; }
        .conduite-section { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; }
        .conduite-header { display: flex; align-items: center; gap: 8px; margin-bottom: 1rem; }
        .conduite-title { font-size: 15px; font-weight: 600; color: #1B2B6B; margin: 0; }
        .conduite-header-icon { font-size: 18px; }
        .conduite-content { display: flex; align-items: center; gap: 12px; background: #F0FDF4; padding: 1rem; border-radius: 10px; border: 1px solid #BBF7D0; }
        .conduite-icon { font-size: 24px; }
        .conduite-text p { font-size: 14px; color: #15803d; font-weight: 500; margin: 0; }
        .conduite-empty { display: flex; align-items: center; gap: 8px; }
        .conduite-empty-icon { font-size: 18px; }
        .conduite-empty-text { font-size: 13px; color: #64748b; margin: 0; }
        
        /* ConclusionSummary overrides */
        .conclusion-summary {}
        .summary-header { display: flex; align-items: center; gap: 8px; margin-bottom: 1rem; }
        .summary-title { font-size: 15px; font-weight: 600; color: #1B2B6B; margin: 0; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem; }
        .summary-card { background: #F8FAFC; border-radius: 10px; padding: 1rem; border: 1px solid #e2e8f0; }
        .card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .card-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .card-title { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; }
        .card-content {}
        .risk-level { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
        .risk-description { font-size: 12px; color: #64748b; margin-bottom: 8px; }
        .acr-score-display { display: flex; align-items: center; gap: 6px; }
        .acr-score { font-size: 18px; font-weight: 700; }
        .type-value { font-size: 16px; font-weight: 700; color: #92400E; }
        .type-description { font-size: 12px; color: #64748b; margin-top: 4px; }
        .patient-name { font-size: 14px; font-weight: 600; color: #1B2B6B; }
        .patient-info { font-size: 12px; color: #64748b; margin-top: 2px; }
        .stats-grid { display: flex; flex-direction: column; gap: 4px; }
        .stat-item { display: flex; justify-content: space-between; }
        .stat-label { font-size: 12px; color: #64748b; }
        .stat-value { font-size: 12px; font-weight: 600; color: #1B2B6B; }
        .conclusion-detail { background: #F8FAFC; border-radius: 10px; padding: 1rem; border: 1px solid #e2e8f0; margin-top: 1rem; }
        .detail-header { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .detail-icon { font-size: 16px; }
        .detail-title { font-size: 13px; font-weight: 600; color: #1B2B6B; margin: 0; }
        .detail-content p { font-size: 13px; color: #374151; line-height: 1.7; margin: 0; }
        .justification-section { background: #EFF6FF; border: 1px solid #BFDBFE; }
        .justification-text { white-space: pre-wrap; }

        /* ProgressIndicator overrides */
        .progress-indicator { padding: 1rem 0; }
        .progress-header { display: flex; align-items: center; gap: 8px; margin-bottom: 1rem; }
        .progress-icon { font-size: 20px; }
        .progress-title { font-size: 14px; font-weight: 600; color: #1B2B6B; margin: 0; }
        .progress-bar-container { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; }
        .progress-bar { flex: 1; height: 8px; background: #EEF2F7; border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #1B2B6B, #4A90D9); border-radius: 4px; transition: width 0.5s ease; }
        .progress-percentage { font-size: 13px; font-weight: 600; color: #1B2B6B; width: 36px; text-align: right; }
        .progress-steps { display: flex; justify-content: space-between; gap: 4px; }
        .progress-step { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
        .step-marker { width: 24px; height: 24px; border-radius: 50%; background: #EEF2F7; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #64748b; transition: all 0.3s; }
        .progress-step.completed .step-marker { background: #1B2B6B; color: white; }
        .step-label { font-size: 10px; color: #64748b; text-align: center; line-height: 1.3; }

        @media (max-width: 1024px) { .form3-body { max-width: 90%; } }
        @media (max-width: 768px) { .form3-body { padding: 1rem; max-width: 100%; } }
      `}</style>

      <div className="form3-page">
        {/* Topbar */}
        <div className="form3-topbar">
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
                  <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 1.5rem" }}>Notre IA analyse vos résultats pour fournir une conclusion précise.</p>
                  <ProgressIndicator
                    currentStep={currentAnalysisStep}
                    totalSteps={analysisSteps.length}
                    stepLabels={analysisSteps}
                  />
                </div>
              ) : (
                <>
                  {/* ACR Score highlight */}
                  {acrScore && (
                    <div className="form3-acr-score-display" style={{ marginBottom: "1.5rem" }}>
                      <div className="form3-score-circle" style={{ background: getAcrColor(acrScore) }}>
                        {acrScore}
                      </div>
                      <div>
                        <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Score BI-RADS / ACR</p>
                        <p style={{ fontSize: "18px", fontWeight: "700", color: getAcrColor(acrScore), margin: "0 0 4px" }}>
                          {acrScore === "1" || acrScore === "2" ? "Probablement bénin" :
                           acrScore === "3" ? "Surveillance recommandée" :
                           acrScore === "4" || acrScore === "5" ? "Très suspect" : "Non défini"}
                        </p>
                        {conduiteIA && (
                          <span style={{ background: "#E6F1FB", color: "#185FA5", fontSize: "12px", padding: "3px 10px", borderRadius: "20px" }}>
                            {conduiteIA}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <ConclusionSummary
                    conclusionIA={conclusionIA}
                    justificationIA={justificationIA}
                    acrScore={acrScore || ""}
                    acrType={acrType}
                    scanData={scanData}
                  />

                  <AcrResultSection
                    conclusionIA={conclusionIA}
                    conduiteIA={conduiteIA}
                    acrType={acrType}
                    acrScore={acrScore}
                  />

                  <button className="form3-report-btn" onClick={openMedicalReport} disabled={!scanData}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    Voir le compte rendu médical
                  </button>
                </>
              )}
            </div>

            {!loadingIA && (
              <div style={{ padding: "1.25rem 1.75rem", borderTop: "1px solid #e2e8f0" }}>
                <button className="form3-submit-btn" onClick={handleSubmit}>
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