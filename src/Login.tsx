import React, { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./hooks/useAuth";

const LoginForm: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [password, setPassword] = useState("");
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
        const result = await login(nom, password);
        if (result.success) {
          toast.success("Connexion réussie !");
        } else {
          toast.error(result.error?.message || "Nom ou mot de passe incorrect");
        }
      } catch (error: unknown) {
        const err = error as Error;
        toast.error(err.message || "Erreur de connexion");
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
          justifyContent: "space-between"
        }}>
          <div>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3rem" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                </svg>
              </div>
              <span style={{ color: "white", fontSize: "18px", fontWeight: "600", letterSpacing: "1px" }}>CANCER IA</span>
            </div>

            <h1 style={{ color: "white", fontSize: "26px", fontWeight: "600", margin: "0 0 1rem", lineHeight: "1.3" }}>
              Plateforme d'aide au diagnostic mammaire
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: "1.7", margin: "0 0 2rem" }}>
              Analyse intelligente assistée par IA pour les radiologues et médecins spécialistes.
            </p>

            {/* Features */}
            {[
              "Calcul automatique du score BI-RADS",
              "Analyse assistée par intelligence artificielle",
              "Génération automatique de rapports médicaux"
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4A90D9", flexShrink: 0 }}></div>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Stats card */}
          <div style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            border: "1px solid rgba(255,255,255,0.15)"
          }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: "0 0 4px" }}>Patients analysés ce mois</p>
            <p style={{ color: "white", fontSize: "22px", fontWeight: "600", margin: "0" }}>
              1,248 <span style={{ color: "#4ade80", fontSize: "13px", fontWeight: "400" }}>+12%</span>
            </p>
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
                placeholder="ex: Dr. Ben Ali"
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
                  placeholder="ex: Selma"
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
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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