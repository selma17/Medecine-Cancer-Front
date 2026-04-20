import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./config";
import MedicalReport from "./formThreeParts/MedicalReport";
import { toast } from "sonner";
/* eslint-disable @typescript-eslint/no-explicit-any*/

interface ScanData {
  scanId?: string;
  clientInfo?: {
    nom?: string;
    prenom?: string;
    renseignementsCliniques?: string;
  };
  mammographie?: {
    densiteMammaire?: string;
    masses?: Array<{
      localisation: string;
      forme: string;
      contours: string;
      densite: string;
      distanceCentre?: string;
      sein?: string;
    }>;
    asymetrie?: boolean;
    typeAsymetrie?: string;
    distorsionArchitecturale?: boolean;
    calcifications?: boolean;
    typesCalcifications?: string;
    signesAssocies?: string[];
  };
  echographie?: {
    echostructureMammaire?: string;
    masses?: Array<{
      localisation: string;
      mesure: string;
      forme: string;
      contours: string;
      densite: string;
      orientation: string;
      comportement: string;
      calcifications: string;
    }>;
    signesAssocies?: string[];
  };
  resultats?: {
    acrScore?: string;
    acrType?: string;
    conclusionIA?: string;
    conduiteATenir?: string;
  };
}

const Finalisation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scanId } = location.state || {};
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const doctorName = user?.nom || "Docteur";

  useEffect(() => {
    if (scanId) {
      axios.get(`${API_BASE_URL}/api/mammary-scan/${scanId}`)
        .then((response) => {
          const scan = response.data;
          setScanData({
            scanId: scan.id?.toString(),
            clientInfo: scan.client ? {
              nom: scan.client.nom,
              prenom: scan.client.prenom,
              renseignementsCliniques: scan.client.renseignementsCliniques
            } : undefined,
            mammographie: {
              densiteMammaire: scan.densiteMammaire,
              masses: scan.massesMammographie?.map((m: any) => ({
                localisation: m.localisation,
                forme: m.forme,
                contours: m.contours,
                densite: m.densite,
                distanceCentre: m.distanceCentre,
                sein: m.sein,
              })) || [],
              asymetrie: scan.asymetrie,
              typeAsymetrie: scan.typeAsymetrie,
              distorsionArchitecturale: scan.distorsionArchitecturale,
              calcifications: scan.calcifications,
              typesCalcifications: scan.typesCalcifications,
              signesAssocies: scan.signesAssociesMammographie?.map((s: any) => s.signe) || []
            },
            echographie: {
              echostructureMammaire: scan.echostructureMammaire,
              masses: scan.massesEchostructure?.map((m: any) => ({
                localisation: m.localisation,
                mesure: m.mesure,
                forme: m.forme,
                contours: m.contours,
                densite: m.densite,
                orientation: m.orientation,
                comportement: m.comportementDesFaisceauxUltrasons,
                calcifications: m.calcifications,
              })) || [],
              signesAssocies: scan.signesAssociesEchostructure?.map((s: any) => s.signe) || []
            },
            resultats: {
              acrScore: scan.conclusionIA,
              acrType: scan.acrType,
              conclusionIA: scan.conclusionIA,
              conduiteATenir: scan.conduiteATenir,
            }
          });
        })
        .catch(() => toast.error("Erreur lors du chargement du scan"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [scanId]);

  const getAcrColor = (score: string) => {
    const map: { [k: string]: string } = {
      "1": "#16a34a", "2": "#16a34a",
      "3": "#f97316", "4": "#e11d48", "5": "#7c2d12"
    };
    return map[score] || "#64748b";
  };

  const extractConduite = (conduite: string) => {
    const actions = ["Surveillance", "Biopsie", "Ablation chirurgicale", "Traitement médical"];
    for (const action of actions) {
      if (conduite?.includes(action)) return action;
    }
    return conduite;
  };

  return (
    <>
      <style>{`
        .final-page {
          min-height: 100vh;
          background: #EEF2F7;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-y: auto;
        }
        .final-topbar {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .final-body {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 1024px) { .final-body { max-width: 90%; } }
        @media (max-width: 768px) { .final-body { padding: 1rem; max-width: 100%; } }
      `}</style>

      <div className="final-page">
        {/* Topbar */}
        <div className="final-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1B2B6B", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2C9 2 7 4 7 6.5c0 2 1.5 3.5 3 5L12 13l2-1.5c1.5-1.5 3-3 3-5C17 4 15 2 12 2z"/>
                <path d="M12 13l-4 6c-.5 1 0 2 1 2s1.5-.5 3-2l0 0c1.5 1.5 2 2 3 2s1.5-1 1-2l-4-6z"/>
              </svg>
            </div>
            <span style={{ fontSize: "15px", fontWeight: "600", color: "#1B2B6B" }}>Cancer IA</span>
          </div>
          <span style={{ fontSize: "13px", color: "#64748b" }}>Dr. {doctorName}</span>
        </div>

        <div className="final-body">
          {loading ? (
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "4rem", textAlign: "center" }}>
              <div style={{ width: "40px", height: "40px", border: "3px solid #EEF2F7", borderTop: "3px solid #1B2B6B", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}/>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Chargement du compte rendu...</p>
            </div>
          ) : (
            <>
              {/* Success banner */}
              <div style={{ background: "#1B2B6B", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", animation: "fadeInUp 0.4s ease both" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "checkPop 0.5s ease 0.3s both" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <h1 style={{ color: "white", fontSize: "20px", fontWeight: "600", margin: "0 0 4px" }}>
                    Analyse terminee avec succes !
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: 0 }}>
                    {scanData?.clientInfo
                      ? `Patient : ${scanData.clientInfo.nom} ${scanData.clientInfo.prenom}`
                      : "Examen enregistre"}
                  </p>
                </div>
              </div>

              {/* Résumé stats */}
              {scanData?.resultats && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem", animation: "fadeInUp 0.4s ease 0.1s both" }}>
                  <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.25rem", textAlign: "center" }}>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 6px", textTransform: "uppercase" }}>Score ACR</p>
                    <p style={{ fontSize: "32px", fontWeight: "700", color: getAcrColor(scanData.resultats.acrScore || ""), margin: 0 }}>
                      {scanData.resultats.acrScore || "—"}
                    </p>
                  </div>

                  <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.25rem", textAlign: "center" }}>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 6px", textTransform: "uppercase" }}>Conduite</p>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#1B2B6B", margin: 0 }}>
                      {extractConduite(scanData.resultats.conduiteATenir || "")}
                    </p>
                  </div>

                  {scanData.resultats.acrType && (
                    <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.25rem", textAlign: "center" }}>
                      <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 6px", textTransform: "uppercase" }}>Type ACR</p>
                      <p style={{ fontSize: "32px", fontWeight: "700", color: "#92400E", margin: 0 }}>
                        {scanData.resultats.acrType}
                      </p>
                    </div>
                  )}

                  <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.25rem", textAlign: "center" }}>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 6px", textTransform: "uppercase" }}>Scan ID</p>
                    <p style={{ fontSize: "20px", fontWeight: "700", color: "#1B2B6B", margin: 0 }}>
                      #{scanData.scanId}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", animation: "fadeInUp 0.4s ease 0.2s both" }}>
                <button
                  onClick={() => setShowReport(true)}
                  style={{ width: "100%", padding: "14px", background: "#1B2B6B", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "inherit", transition: "background 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#243d8f"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#1B2B6B"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  Voir et imprimer le compte rendu medical
                </button>

                <button
                  onClick={() => navigate("/patient-management")}
                  style={{ width: "100%", padding: "14px", background: "white", color: "#1B2B6B", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "inherit", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#EEF2F7"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B2B6B" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                  </svg>
                  Voir tous les patients
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  style={{ width: "100%", padding: "14px", background: "white", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "inherit", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#EEF2F7"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                  </svg>
                  Retour au tableau de bord
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {scanData && (
        <MedicalReport
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          scanData={scanData}
        />
      )}
    </>
  );
};

export default Finalisation;