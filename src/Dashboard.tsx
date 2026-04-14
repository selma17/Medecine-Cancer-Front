import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './navigation/navigationConfig';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
  const [greeting, setGreeting] = useState("");

  // Récupérer le nom du médecin
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const doctorName = user?.nom || "Docteur";

  // Greeting selon l'heure
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  // Animation des stats au chargement
  useEffect(() => {
    const targets = [0, 0, 0, 0];
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setAnimatedStats(targets.map(t => Math.round((t * step) / steps)));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "Total patients", value: "—", color: "#1B2B6B", bg: "#EEF2F7", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B2B6B" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
    { label: "Examens ce mois", value: "—", color: "#4A90D9", bg: "#E6F1FB", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg> },
    { label: "ACR 4-5 détectés", value: "—", color: "#e11d48", bg: "#FFF1F2", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { label: "Rapports générés", value: "—", color: "#16a34a", bg: "#F0FDF4", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  ];

  const navItems = [
    { label: "Tableau de bord", route: "/dashboard", active: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { label: "Patients", route: ROUTES.PATIENT_HISTORY, active: false, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: "Nouvel examen", route: ROUTES.ADD_PATIENT, active: false, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  ];

  const Sidebar = () => (
    <aside style={{
      width: "240px", background: "#1B2B6B", display: "flex",
      flexDirection: "column", flexShrink: 0, height: "100vh",
      position: "sticky", top: 0
    }}>
      <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2C9 2 7 4 7 6.5c0 2 1.5 3.5 3 5L12 13l2-1.5c1.5-1.5 3-3 3-5C17 4 15 2 12 2z"/>
              <path d="M12 13l-4 6c-.5 1 0 2 1 2s1.5-.5 3-2l0 0c1.5 1.5 2 2 3 2s1.5-1 1-2l-4-6z"/>
            </svg>
          </div>
          <span style={{ color: "white", fontWeight: "600", fontSize: "15px", letterSpacing: "1px" }}>CANCER IA</span>
        </div>
      </div>

      {/* Doctor info */}
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
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 1.5rem", cursor: "pointer",
              background: item.active ? "rgba(255,255,255,0.1)" : "transparent",
              borderLeft: item.active ? "3px solid #4A90D9" : "3px solid transparent",
              color: item.active ? "white" : "rgba(255,255,255,0.6)",
              fontSize: "14px", transition: "all 0.2s", marginBottom: "4px"
            }}
            onMouseEnter={(e) => { if (!item.active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "white"; }}}
            onMouseLeave={(e) => { if (!item.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={logout} style={{
          width: "100%", padding: "10px", background: "rgba(255,255,255,0.1)",
          color: "white", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px", fontSize: "14px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
          fontFamily: "inherit", transition: "background 0.2s"
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EEF2F7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Sidebar desktop */}
      <div style={{ display: "none" }} className="sidebar-desktop">
        <Sidebar />
      </div>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "relative", zIndex: 51 }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Sidebar desktop visible */}
      <div style={{ display: "flex" }} id="sidebar-wrapper">
        <Sidebar />
      </div>

      {/* CONTENU PRINCIPAL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* HEADER */}
        <header style={{
          background: "white", padding: "1rem 2rem",
          borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Burger menu mobile */}
            <button onClick={() => setSidebarOpen(true)} style={{
              display: "none", background: "none", border: "none",
              cursor: "pointer", padding: "4px"
            }} id="burger-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B2B6B" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: "600", color: "#1B2B6B", margin: 0 }}>
                {greeting}, Dr. {doctorName} 👋
              </h1>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#1B2B6B", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "600" }}>
            {doctorName.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* BODY */}
        <main style={{ padding: "2rem", flex: 1 }}>

          {/* STATS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem", marginBottom: "2rem"
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{
                background: "white", borderRadius: "12px", padding: "1.25rem",
                border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "1rem",
                animation: `fadeInUp 0.4s ease ${i * 0.1}s both`,
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 2px" }}>{stat.label}</p>
                  <p style={{ fontSize: "22px", fontWeight: "600", color: stat.color, margin: 0 }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS RAPIDES + CHART */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>

            {/* Actions rapides */}
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#1B2B6B", margin: "0 0 1rem" }}>Actions rapides</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div onClick={() => navigate(ROUTES.ADD_PATIENT)}
                  style={{ background: "#1B2B6B", borderRadius: "12px", padding: "1.25rem", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", display: "flex", alignItems: "center", gap: "1rem" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,43,107,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  </div>
                  <div>
                    <p style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: "0 0 2px" }}>Nouveau patient</p>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: 0 }}>Ajouter et analyser</p>
                  </div>
                  <svg style={{ marginLeft: "auto" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </div>

                <div onClick={() => navigate(ROUTES.PATIENT_HISTORY)}
                  style={{ background: "white", borderRadius: "12px", padding: "1.25rem", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", display: "flex", alignItems: "center", gap: "1rem", border: "1px solid #e2e8f0" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: "40px", height: "40px", background: "#EEF2F7", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B2B6B" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div>
                    <p style={{ color: "#1B2B6B", fontWeight: "600", fontSize: "14px", margin: "0 0 2px" }}>Mes patients</p>
                    <p style={{ color: "#64748b", fontSize: "12px", margin: 0 }}>Consulter les dossiers</p>
                  </div>
                  <svg style={{ marginLeft: "auto" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </div>

            {/* Mini chart placeholder */}
            <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#1B2B6B", margin: "0 0 1rem" }}>Activité récente</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { month: "Jan", val: 60 }, { month: "Fév", val: 45 },
                  { month: "Mar", val: 75 }, { month: "Avr", val: 90 },
                  { month: "Mai", val: 55 }, { month: "Juin", val: 80 },
                ].map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "11px", color: "#64748b", width: "28px" }}>{d.month}</span>
                    <div style={{ flex: 1, height: "8px", background: "#EEF2F7", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: "4px",
                        background: `linear-gradient(90deg, #1B2B6B, #4A90D9)`,
                        width: `${d.val}%`,
                        animation: `expandBar 0.8s ease ${i * 0.1}s both`
                      }}/>
                    </div>
                    <span style={{ fontSize: "11px", color: "#1B2B6B", fontWeight: "500", width: "28px" }}>{d.val}%</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: "12px 0 0", textAlign: "center" }}>
                Données simulées — connectées après intégration BDD
              </p>
            </div>
          </div>

          {/* INFO BOX */}
          <div style={{ background: "#E6F1FB", borderRadius: "12px", padding: "1.25rem", border: "1px solid #B5D4F4", display: "flex", alignItems: "center", gap: "1rem" }}>
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

      {/* CSS animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes expandBar {
          from { width: 0; }
          to { width: var(--target-width); }
        }
        @media (max-width: 768px) {
          #sidebar-wrapper { display: none !important; }
          #burger-btn { display: block !important; }
        }
        @media (max-width: 640px) {
          main { padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;