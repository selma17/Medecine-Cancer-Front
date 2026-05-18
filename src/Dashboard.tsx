import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './navigation/navigationConfig';
import axios from 'axios';
import { API_BASE_URL } from './config';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalPatients: '—',
    examensThisMonth: '—',
    acr45: '—',
    rapports: '—',
  });

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const doctorName = user?.nom || "Docteur";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);

        // Récupérer les clients du médecin
        const clientsRes = await axios.get(`${API_BASE_URL}/api/clients/by-medecin`);
        const clients = clientsRes.data;

        // Récupérer tous les scans
        const scansRes = await axios.get(`${API_BASE_URL}/api/mammary-scan/all`);
        const allScans = scansRes.data;

        // Filtrer scans du médecin
        const clientIds = new Set(clients.map((c: { id: number }) => c.id));
        const myScans = allScans.filter((s: { client?: { id: number } }) =>
          s.client && clientIds.has(s.client.id)
        );

        // Rapports générés = scans avec conclusionIA non null/vide
        const scansAvecRapport = myScans.filter((s: { conclusionIA?: string }) =>
          s.conclusionIA !== null && s.conclusionIA !== undefined && s.conclusionIA !== ''
        );
        const rapports = scansAvecRapport.length;

        // Total patients = uniquement ceux ayant au moins un rapport généré
        const clientsAvecRapport = new Set(
          scansAvecRapport
            .filter((s: { client?: { id: number } }) => s.client)
            .map((s: { client: { id: number } }) => s.client.id)
        );
        const totalPatients = clientsAvecRapport.size;

        // Examens total = tous les scans du médecin (même sans rapport)
        const examensThisMonth = myScans.length;

        // ACR 4-5
        const acr45 = scansAvecRapport.filter((s: { conclusionIA?: string }) =>
          s.conclusionIA === '4' || s.conclusionIA === '5'
        ).length;

        setStatsData({
          totalPatients: String(totalPatients),
          examensThisMonth: String(examensThisMonth),
          acr45: String(acr45),
          rapports: String(rapports),
        });
      } catch (error) {
        console.error('Erreur stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const navItems = [
    { label: "Tableau de bord", route: "/dashboard", active: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { label: "Patients", route: ROUTES.PATIENT_HISTORY, active: false, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: "Nouvel examen", route: ROUTES.ADD_PATIENT, active: false, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  ];

  const stats = [
    { label: "Total patients", value: statsData.totalPatients, color: "#1B2B6B", bg: "#EEF2F7", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B2B6B" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
    { label: "Examens total", value: statsData.examensThisMonth, color: "#4A90D9", bg: "#E6F1FB", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg> },
    { label: "ACR 4-5 détectés", value: statsData.acr45, color: "#e11d48", bg: "#FFF1F2", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { label: "Rapports générés", value: statsData.rapports, color: "#16a34a", bg: "#F0FDF4", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  ];

  const SidebarContent = () => (
    <aside style={{ width: "240px", background: "#1B2B6B", display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Logo + Nom */}
      <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/logo-octobre-rose.png"
            alt="Logo"
            style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "6px" }}
          />
          <span style={{ color: "white", fontWeight: "600", fontSize: "15px", letterSpacing: "0.5px" }}>
            E-Radiologie
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
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={logout} style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", fontFamily: "inherit", transition: "background 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EEF2F7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div className="sidebar-desktop-wrapper"><SidebarContent /></div>

      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "relative", zIndex: 51 }}><SidebarContent /></div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ background: "white", padding: "1rem 2rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="burger-btn" onClick={() => setSidebarOpen(true)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B2B6B" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: "600", color: "#1B2B6B", margin: 0 }}>Tableau de bord</h1>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#1B2B6B", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "600" }}>
            {doctorName.charAt(0).toUpperCase()}
          </div>
        </header>

        <main style={{ padding: "2rem", flex: 1 }}>
          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "1rem", transition: "transform 0.2s, box-shadow 0.2s", animation: `fadeInUp 0.4s ease ${i * 0.1}s both` }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 2px" }}>{stat.label}</p>
                  <p style={{ fontSize: "22px", fontWeight: "600", color: stat.color, margin: 0 }}>
                    {statsLoading ? (
                      <div style={{ width: "20px", height: "20px", border: "2px solid #EEF2F7", borderTop: `2px solid ${stat.color}`, borderRadius: "50%", animation: "spin 1s linear infinite" }}/>
                    ) : stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS RAPIDES */}
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#1B2B6B", margin: "0 0 1rem" }}>Actions rapides</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div onClick={() => navigate(ROUTES.ADD_PATIENT)}
              style={{ background: "#1B2B6B", borderRadius: "14px", padding: "1.75rem", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", display: "flex", alignItems: "center", gap: "1rem", border: "1px solid transparent", animation: "fadeInUp 0.4s ease 0.4s both" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,43,107,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "44px", height: "44px", background: "rgba(255,255,255,0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "white", fontWeight: "600", fontSize: "15px", margin: "0 0 4px" }}>Nouveau patient</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: 0 }}>Ajouter un patient et effectuer l'analyse</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

            <div onClick={() => navigate(ROUTES.PATIENT_HISTORY)}
              style={{ background: "white", borderRadius: "14px", padding: "1.75rem", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", display: "flex", alignItems: "center", gap: "1rem", border: "1px solid #e2e8f0", animation: "fadeInUp 0.4s ease 0.5s both" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "44px", height: "44px", background: "#EEF2F7", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B2B6B" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#1B2B6B", fontWeight: "600", fontSize: "15px", margin: "0 0 4px" }}>Mes patients</p>
                <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>Consulter et gérer vos dossiers patients</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          {/* INFO BOX */}
          <div style={{ background: "#E6F1FB", borderRadius: "12px", padding: "1.25rem", border: "1px solid #B5D4F4", display: "flex", alignItems: "center", gap: "1rem", animation: "fadeInUp 0.4s ease 0.6s both" }}>
            <div style={{ width: "40px", height: "40px", background: "#1B2B6B", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#1B2B6B", margin: "0 0 2px" }}>Plateforme médicale sécurisée</p>
              <p style={{ fontSize: "12px", color: "#185FA5", margin: 0 }}>Toutes vos données sont chiffrées et protégées. Seul vous avez accès à vos patients.</p>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .sidebar-desktop-wrapper { display: flex; }
        .burger-btn { display: none !important; }
        @media (max-width: 768px) {
          .sidebar-desktop-wrapper { display: none !important; }
          .burger-btn { display: block !important; }
          main { padding: 1rem !important; }
          header { padding: 1rem !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;