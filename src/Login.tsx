import React, { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./hooks/useAuth";

const LoginForm: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisterMode) {
      try {
        const result = await register(nom, prenom, password);
        if (result.success) {
          toast.success("Compte créé avec succès !");
          setIsRegisterMode(false);
          setPrenom("");
        } else {
          toast.error(result.error?.message || "Erreur lors de la création du compte");
        }
      } catch (error: unknown) {
        const err = error as Error;
        toast.error(err.message || "Erreur lors de la création du compte");
      }
    } else {
      try {
        await login(nom, password);
        toast.success("Connexion réussie !");
      } catch (error: unknown) {
        const err = error as Error;
        toast.error(err.message || "Nom ou mot de passe incorrect");
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#EEF2F7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        width: "100%",
        maxWidth: "900px",
        minHeight: "540px",
        background: "white",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
      }}>

        {/* PANNEAU GAUCHE */}
        <div style={{
          background: "#1B2B6B",
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <div>
            {/* Logo Octobre Rose */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3rem" }}>
              <img
                src="/logo-octobre-rose.png"
                alt="Octobre Rose"
                style={{ width: "40px", height: "40px", objectFit: "contain" }}
              />
              <span style={{ color: "white", fontSize: "18px", fontWeight: "600", letterSpacing: "1px" }}>
                Breast AI Report 
              </span>
            </div>

            <h1 style={{ color: "white", fontSize: "26px", fontWeight: "600", margin: "0 0 1rem", lineHeight: "1.3" }}>
              Plateforme d'aide au diagnostic mammaire
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: "1.7", margin: "0 0 2rem" }}>
              Rédaction assistée par l'IA des comptes rendus de mammographie et d'échographie.
            </p>

            {/* Features — sans "Analyse assistée par intelligence artificielle" */}
            {[
              "Calcul automatique du score BI-RADS",
              "Génération automatique de rapports médicaux"
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E8A0B4", flexShrink: 0 }}></div>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PANNEAU DROIT */}
        <div style={{
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1B2B6B", margin: "0 0 0.5rem" }}>
            {isRegisterMode ? "Créer un compte" : "Bienvenue, Docteur"}
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 2rem" }}>
            {isRegisterMode ? "Remplissez vos informations" : "Connectez-vous à votre espace médical"}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Nom */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "6px" }}>
                Nom d'utilisateur
              </label>
              <input
                type="text"
                placeholder="ex: Dr. Khouja"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "10px 14px", fontSize: "14px",
                  border: "1px solid #e2e8f0", borderRadius: "8px",
                  outline: "none", transition: "border-color 0.2s",
                  fontFamily: "inherit"
                }}
                onFocus={(e) => e.target.style.borderColor = "#1B2B6B"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            {/* Prénom (register seulement) */}
            {isRegisterMode && (
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "6px" }}>
                  Prénom
                </label>
                <input
                  type="text"
                  placeholder="ex: Seif"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "10px 14px", fontSize: "14px",
                    border: "1px solid #e2e8f0", borderRadius: "8px",
                    outline: "none", fontFamily: "inherit"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#1B2B6B"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            )}

            {/* Mot de passe */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "6px" }}>
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "10px 42px 10px 14px", fontSize: "14px",
                    border: "1px solid #e2e8f0", borderRadius: "8px",
                    outline: "none", fontFamily: "inherit"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#1B2B6B"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
                {/* Icône œil */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer", padding: "0",
                    color: "#94a3b8", display: "flex", alignItems: "center"
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    // Œil barré (masquer)
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    // Œil ouvert (afficher)
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {!isRegisterMode && (
                <div style={{ textAlign: "right", marginTop: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#4A90D9", cursor: "pointer" }}>
                    Mot de passe oublié ?
                  </span>
                </div>
              )}
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              style={{
                width: "100%", padding: "12px",
                background: "#1B2B6B", color: "white",
                border: "none", borderRadius: "8px",
                fontSize: "15px", fontWeight: "600",
                cursor: "pointer", marginBottom: "1rem",
                fontFamily: "inherit", transition: "background 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#243d8f")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1B2B6B")}
            >
              {isRegisterMode ? "Créer un compte" : "Se connecter"}
            </button>

            {/* Séparateur */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>ou</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
            </div>

            {/* Toggle login/register */}
            <button
              type="button"
              onClick={() => { setIsRegisterMode(!isRegisterMode); setPrenom(""); }}
              style={{
                width: "100%", padding: "10px",
                background: "transparent",
                border: "1px solid #e2e8f0",
                borderRadius: "8px", fontSize: "13px",
                color: "#64748b", cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              {isRegisterMode ? "Déjà un compte ? Se connecter" : "Créer un compte"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "11px", color: "#94a3b8", margin: "1.5rem 0 0" }}>
            Plateforme réservée aux professionnels de santé
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;