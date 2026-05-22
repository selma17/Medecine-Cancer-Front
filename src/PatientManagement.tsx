/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './navigation/navigationConfig';
import { getAllPatients, deletePatient, Patient } from './services/patientService';
import { toast } from 'sonner';
import MedicalReport from './formThreeParts/MedicalReport';
import axios from 'axios';
import { API_BASE_URL } from './config';

const PatientManagement: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 10;
  const [showReport, setShowReport] = useState(false);
  const [reportScanData, setReportScanData] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const doctorName = user?.nom || "Docteur";

  useEffect(() => { loadPatients(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPatients();
      setPatients(data);
    } catch {
      setError('Erreur lors du chargement des patients.');
      toast.error('Erreur lors du chargement des patients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient?.scanId && !patient?.clientId) return;
    if (!window.confirm(`Supprimer ${patient.nom} ${patient.prenom} ?`)) return;
    try {
      await deletePatient(patient.scanId, patient.clientId);
      toast.success('Patient supprimé');
      await loadPatients();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleView = async (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient?.scanId) {
      toast.error('Aucun examen disponible pour ce patient');
      return;
    }
    try {
      setLoadingReport(true);
      const response = await axios.get(`${API_BASE_URL}/api/mammary-scan/${patient.scanId}`);
      const scan = response.data;
      setReportScanData({
        scanId: scan.id?.toString(),
        clientInfo: scan.client ? {
          nom: scan.client.nom,
          prenom: scan.client.prenom,
          dateNaissance: scan.client.dateNaissance,
          telephone: scan.client.telephone,
          renseignementsCliniques: scan.client.renseignementsCliniques
        } : null,
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
          asymetrie:                scan.asymetrie,
          typeAsymetrie:            scan.typeAsymetrie,
          localisationAsymetrie:    scan.localisationAsymetrie,
          distorsionArchitecturale: scan.distorsionArchitecturale,
          localisationDistorsion:   scan.localisationDistorsion,
          calcifications:           scan.calcifications,
          typesCalcifications:      scan.typesCalcifications,
          localisationCalcifications: scan.localisationCalcifications,
          signesAssocies:           scan.signesAssociesMammographie || []
        },
        echographie: {
          echostructureMammaire: scan.echostructureMammaire,
          masses: scan.massesEchostructure?.map((m: any) => ({
            localisation:   m.localisation,
            distanceCentre: m.distanceCentre,
            mesure:         m.mesure,
            forme:          m.forme,
            contours:       m.contours,
            densite:        m.densite,
            orientation:    m.orientation,
            comportement:   m.comportementDesFaisceauxUltrasons,
            calcifications: m.calcifications,
            sein:           m.sein,
          })) || [],
          signesAssocies: scan.signesAssociesEchostructure || []
        },
        resultats: {
          acrScore:            scan.conclusionIA,
          acrType:             scan.acrType,
          conclusionIA:        scan.conclusionIA,
          conduiteATenir:      scan.conduiteATenir,
          acrDroit:            scan.acrDroit            || "",
          acrGauche:           scan.acrGauche           || "",
          recommendationDroit:  scan.recommandationDroit  || "",
          recommendationGauche: scan.recommandationGauche || "",
          fullAiResponse:      scan.fullAiResponse       || "",
          seinsAvecMasses:     (() => {
            const masses = [
              ...(scan.massesMammographie || []),
              ...(scan.massesEchostructure || []),
            ];
            const s = new Set<string>();
            masses.forEach((m: any) => {
              if (m.sein?.toLowerCase().startsWith("droit")) s.add("droit");
              if (m.sein?.toLowerCase().startsWith("gauche")) s.add("gauche");
            });
            if (s.size === 0 && masses.length > 0) { s.add("droit"); s.add("gauche"); }
            return Array.from(s);
          })(),
        }
      });
      setShowReport(true);
    } catch {
      toast.error('Erreur lors du chargement du compte rendu');
    } finally {
      setLoadingReport(false);
    }
  };

  const filtered = patients.filter(p =>
    `${p.nom} ${p.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const current = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const navItems = [
    { label: "Tableau de bord", route: ROUTES.DASHBOARD, active: false, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { label: "Patients", route: ROUTES.PATIENT_HISTORY, active: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: "Nouvel examen", route: ROUTES.ADD_PATIENT, active: false, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  ];

  const SidebarContent = () => (
    <aside style={{ width: "240px", background: "#1B2B6B", display: "flex", flexDirection: "column", minHeight: "100%", height: "100%" }}>
      <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/logo-octobre-rose.png"
            alt="Logo"
            style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "6px" }}
          />
          <span style={{ color: "white", fontWeight: "600", fontSize: "15px", letterSpacing: "0.5px" }}>
            Breast AI Report
          </span>
        </div>
      </div>

      {/* Médecin */}
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#4A90D9", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "600", flexShrink: 0 }}>
            {doctorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ color: "white", fontSize: "13px", fontWeight: "500", margin: 0 }}>Dr. {doctorName}</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: 0 }}>Radiologue</p>
          </div>
        </div>
      </div>

      <nav style={{ padding: "1rem 0", flex: 1 }}>
        {navItems.map((item, i) => (
          <div key={i} onClick={() => { navigate(item.route); setSidebarOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 1.5rem", cursor: "pointer", background: item.active ? "rgba(255,255,255,0.1)" : "transparent", borderLeft: item.active ? "3px solid #4A90D9" : "3px solid transparent", color: item.active ? "white" : "rgba(255,255,255,0.6)", fontSize: "14px", transition: "all 0.2s", marginBottom: "4px" }}
            onMouseEnter={(e) => { if (!item.active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "white"; }}}
            onMouseLeave={(e) => { if (!item.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}}
          >
            {item.icon}<span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={logout} style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", fontFamily: "inherit" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );

  const getAcrColor = (acr: string) => {
    if (acr === '-' || !acr) return { bg: "#EEF2F7", color: "#64748b" };
    const num = parseInt(acr);
    if (num <= 2) return { bg: "#F0FDF4", color: "#16a34a" };
    if (num === 3) return { bg: "#FFFBEB", color: "#d97706" };
    return { bg: "#FFF1F2", color: "#e11d48" };
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#EEF2F7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      <div className="sidebar-desktop-wrapper"><SidebarContent /></div>

      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "relative", zIndex: 51 }}><SidebarContent /></div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflow: "hidden" }}>
        <header style={{ background: "white", padding: "1rem 2rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="burger-btn" onClick={() => setSidebarOpen(true)} style={{ display: "none", background: "none", border: "none", cursor: "pointer" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B2B6B" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: "600", color: "#1B2B6B", margin: 0 }}>Gestion des patients</h1>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>{filtered.length} patient{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#1B2B6B", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "600" }}>
            {doctorName.charAt(0).toUpperCase()}
          </div>
        </header>

        <main style={{ padding: "2rem", flex: 1, overflowY: "auto" }}>
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", animation: "fadeInUp 0.4s ease both" }}>

            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#1B2B6B", margin: 0 }}>Liste des patients</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ position: "relative" }}>
                  <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" placeholder="Rechercher par nom..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "8px 12px 8px 38px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", width: "240px", outline: "none", fontFamily: "inherit" }}
                    onFocus={(e) => e.target.style.borderColor = "#1B2B6B"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <button onClick={() => navigate(ROUTES.ADD_PATIENT)}
                  style={{ padding: "8px 16px", background: "#1B2B6B", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "inherit" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#243d8f"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#1B2B6B"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Nouveau patient
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 100px 120px", padding: "12px 2rem", background: "#F8FAFC", borderBottom: "1px solid #e2e8f0" }}>
              {["Nom et Prénom", "ACR", "Actions"].map((h, i) => (
                <div key={i} style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: i > 0 ? "center" : "left" }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: "4rem", textAlign: "center" }}>
                <div style={{ width: "32px", height: "32px", border: "3px solid #EEF2F7", borderTop: "3px solid #1B2B6B", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}/>
                <p style={{ color: "#64748b", fontSize: "14px" }}>Chargement des patients...</p>
              </div>
            ) : error ? (
              <div style={{ padding: "4rem", textAlign: "center" }}>
                <p style={{ color: "#e11d48", fontSize: "14px", marginBottom: "1rem" }}>{error}</p>
                <button onClick={loadPatients} style={{ padding: "8px 20px", background: "#1B2B6B", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "inherit" }}>Réessayer</button>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "4rem", textAlign: "center" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ marginBottom: "1rem" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <p style={{ color: "#64748b", fontSize: "14px" }}>Aucun patient trouvé</p>
              </div>
            ) : (
              current.map((patient, i) => {
                const acrStyle = getAcrColor(patient.acr);
                return (
                  <div key={patient.id} style={{ display: "grid", gridTemplateColumns: "2fr 100px 120px", padding: "1rem 2rem", borderBottom: "1px solid #f1f5f9", alignItems: "center", transition: "background 0.15s", animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#EEF2F7", display: "flex", alignItems: "center", justifyContent: "center", color: "#1B2B6B", fontSize: "12px", fontWeight: "600", flexShrink: 0 }}>
                        {patient.nom.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: "#1e293b" }}>
                        {patient.nom} {patient.prenom}
                      </span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <span style={{ background: acrStyle.bg, color: acrStyle.color, padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                        {patient.acr || "—"}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                      <button onClick={() => handleView(patient.id)}
                        style={{ width: "34px", height: "34px", background: "#EEF2F7", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#1B2B6B"; (e.currentTarget.firstChild as SVGElement).style.stroke = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#EEF2F7"; (e.currentTarget.firstChild as SVGElement).style.stroke = "#1B2B6B"; }}
                        title="Voir le compte rendu"
                      >
                        {loadingReport ? (
                          <div style={{ width: "14px", height: "14px", border: "2px solid #EEF2F7", borderTop: "2px solid #1B2B6B", borderRadius: "50%", animation: "spin 1s linear infinite" }}/>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B2B6B" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                      <button onClick={() => handleDelete(patient.id)}
                        style={{ width: "34px", height: "34px", background: "#FFF1F2", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#e11d48"; (e.currentTarget.firstChild as SVGElement).style.stroke = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#FFF1F2"; (e.currentTarget.firstChild as SVGElement).style.stroke = "#e11d48"; }}
                        title="Supprimer"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {!loading && !error && totalPages > 1 && (
              <div style={{ padding: "1.25rem 2rem", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                  {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} sur {filtered.length}
                </p>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    style={{ padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1, fontSize: "13px", fontFamily: "inherit" }}>
                    Précédent
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).map((p, i, arr) => (
                    <React.Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && <span style={{ padding: "6px 4px", fontSize: "13px", color: "#94a3b8" }}>…</span>}
                      <button onClick={() => setCurrentPage(p)}
                        style={{ width: "34px", height: "34px", border: "1px solid #e2e8f0", borderRadius: "8px", background: currentPage === p ? "#1B2B6B" : "white", color: currentPage === p ? "white" : "#1e293b", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    style={{ padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1, fontSize: "13px", fontFamily: "inherit" }}>
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {reportScanData && (
        <MedicalReport
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          scanData={reportScanData}
        />
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sidebar-desktop-wrapper { display: flex; align-self: stretch; }
        .burger-btn { display: none !important; }
        @media (max-width: 768px) {
          .sidebar-desktop-wrapper { display: none !important; }
          .burger-btn { display: block !important; }
          main { padding: 1rem !important; }
          header { padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
};

export default PatientManagement;