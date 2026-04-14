import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './navigation/navigationConfig';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EEF2F7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: "240px", background: "#1B2B6B", display: "flex",
        flexDirection: "column", padding: "0", flexShrink: 0
      }}>
        {/* Logo */}
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

        {/* Nav items */}
        <nav style={{ padding: "1rem 0", flex: 1 }}>
          {[
            { label: "Tableau de bord", route: "/dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>, active: true },
            { label: "Patients", route: ROUTES.PATIENT_HISTORY, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
            { label: "Nouvel examen", route: ROUTES.ADD_PATIENT, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
          ].map((item, i) => (
            <div key={i} onClick={() => navigate(item.route)}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 1.5rem", cursor: "pointer",
                background: item.active ? "rgba(255,255,255,0.1)" : "transparent",
                borderLeft: item.active ? "3px solid #4A90D9" : "3px solid transparent",
                color: item.active ? "white" : "rgba(255,255,255,0.6)",
                fontSize: "14px", transition: "all 0.2s",
                marginBottom: "4px"
              }}
              onMouseEnter={(e) => { if (!item.active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "white"; }}}
              onMouseLeave={(e) => { if (!item.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={logout} style={{
            width: "100%", padding: "10px", background: "rgba(255,255,255,0.1)",
            color: "white", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px", fontSize: "14px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px", justifyContent: "center",
            fontFamily: "inherit"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>

        {/* HEADER */}
        <header style={{
          background: "white", padding: "1rem 2rem",
          borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "600", color: "#1B2B6B", margin: 0 }}>Tableau de bord</h1>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Bienvenue sur votre espace médical</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "#1B2B6B", display: "flex", alignItems: "center",
              justifyContent: "center", color: "white", fontSize: "14px", fontWeight: "600"
            }}>Dr</div>
          </div>
        </header>

        {/* BODY */}
        <main style={{ padding: "2rem", flex: 1 }}>

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "Total patients", value: "—", color: "#1B2B6B", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B2B6B" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
              { label: "Examens ce mois", value: "—", color: "#4A90D9", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg> },
              { label: "ACR 4-5 détectés", value: "—", color: "#e11d48", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
              { label: "Rapports générés", value: "—", color: "#16a34a", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
            ].map((stat, i) => (
              <div key={i} style={{
                background: "white", borderRadius: "12px", padding: "1.25rem",
                border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "1rem"
              }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#EEF2F7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 2px" }}>{stat.label}</p>
                  <p style={{ fontSize: "22px", fontWeight: "600", color: stat.color, margin: 0 }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIONS RAPIDES */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#1B2B6B", margin: "0 0 1rem" }}>Actions rapides</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

              {/* Nouveau patient */}
              <div onClick={() => navigate(ROUTES.ADD_PATIENT)}
                style={{
                  background: "#1B2B6B", borderRadius: "14px", padding: "1.75rem",
                  cursor: "pointer", transition: "transform 0.2s", color: "white"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ width: "44px", height: "44px", background: "rgba(255,255,255,0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: "600", margin: "0 0 6px" }}>Nouveau patient</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0 }}>Ajouter un patient et effectuer l'analyse</p>
              </div>

              {/* Historique */}
              <div onClick={() => navigate(ROUTES.PATIENT_HISTORY)}
                style={{
                  background: "white", borderRadius: "14px", padding: "1.75rem",
                  cursor: "pointer", transition: "transform 0.2s",
                  border: "1px solid #e2e8f0"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ width: "44px", height: "44px", background: "#EEF2F7", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B2B6B" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1B2B6B", margin: "0 0 6px" }}>Mes patients</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Consulter et gérer vos dossiers patients</p>
              </div>

            </div>
          </div>

          {/* INFO BOX */}
          <div style={{
            background: "#E6F1FB", borderRadius: "12px", padding: "1.25rem",
            border: "1px solid #B5D4F4", display: "flex", alignItems: "center", gap: "1rem"
          }}>
            <div style={{ width: "40px", height: "40px", background: "#1B2B6B", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#1B2B6B", margin: "0 0 2px" }}>Plateforme médicale sécurisée</p>
              <p style={{ fontSize: "12px", color: "#185FA5", margin: 0 }}>Toutes vos données sont chiffrées et protégées. Seul vous avez accès à vos patients.</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;