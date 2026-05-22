import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./config";
import { toast } from "sonner";
import { useScanStore } from "./store/useScanStore";

const AddPatientForm: React.FC = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [telephone, setTelephone] = useState("");
  const [renseignements, setRenseignements] = useState("");
  const [emailPatient, setEmailPatient] = useState("");
  const [emailMedecin, setEmailMedecin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setClientId } = useScanStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/clients/enregistrer`,
        { nom, prenom, dateNaissance, telephone, renseignementsCliniques: renseignements, emailPatient, emailMedecin }
      );
      setClientId(response.data.id);
      toast.success("Patient enregistré avec succès !");
      navigate("/formone");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const doctorName = user?.nom || "Docteur";

  const inputStyle = {
    width: "100%", boxSizing: "border-box" as const,
    padding: "10px 14px", fontSize: "14px",
    border: "1px solid #e2e8f0", borderRadius: "8px",
    outline: "none", fontFamily: "inherit", transition: "border-color 0.2s"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EEF2F7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "560px", animation: "fadeInUp 0.4s ease both" }}>

        <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "14px", marginBottom: "1.5rem", padding: 0, fontFamily: "inherit" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Retour
        </button>

        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>

          <div style={{ background: "#1B2B6B", padding: "1.75rem 2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <div>
                <h1 style={{ color: "white", fontSize: "18px", fontWeight: "600", margin: 0 }}>Nouveau patient</h1>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: 0 }}>Dr. {doctorName}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: "2rem" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "6px", fontWeight: "500" }}>Nom *</label>
                <input type="text" placeholder="ex: Ben Ali" value={nom}
                  onChange={(e) => setNom(e.target.value)} required style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#1B2B6B"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "6px", fontWeight: "500" }}>Prénom *</label>
                <input type="text" placeholder="ex: Sonia" value={prenom}
                  onChange={(e) => setPrenom(e.target.value)} required style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#1B2B6B"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "6px", fontWeight: "500" }}>Date de naissance *</label>
                <input type="date" value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)} required style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#1B2B6B"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "6px", fontWeight: "500" }}>Téléphone</label>
                <input type="tel" placeholder="ex: 22 690 725" value={telephone}
                  onChange={(e) => setTelephone(e.target.value)} style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#1B2B6B"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "6px", fontWeight: "500" }}>Email patient</label>
                <input type="email" placeholder="ex: patient@email.com" value={emailPatient}
                  onChange={(e) => setEmailPatient(e.target.value)} style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#1B2B6B"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div>
                <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "6px", fontWeight: "500" }}>Email médecin traitant</label>
                <input type="email" placeholder="ex: medecin@email.com" value={emailMedecin}
                  onChange={(e) => setEmailMedecin(e.target.value)} style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#1B2B6B"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{ fontSize: "13px", color: "#64748b", display: "block", marginBottom: "6px", fontWeight: "500" }}>Renseignements cliniques *</label>
              <textarea placeholder="Antécédents médicaux, motif de consultation..."
                value={renseignements} onChange={(e) => setRenseignements(e.target.value)}
                required rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => e.target.style.borderColor = "#1B2B6B"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div style={{ background: "#E6F1FB", borderRadius: "8px", padding: "10px 14px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p style={{ fontSize: "12px", color: "#185FA5", margin: 0 }}>Après enregistrement, vous serez redirigé vers le formulaire d'examen mammographique.</p>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "12px", background: loading ? "#94a3b8" : "#1B2B6B", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#243d8f"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1B2B6B"; }}
            >
              {loading ? (
                <><div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 1s linear infinite" }}/>Enregistrement...</>
              ) : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Enregistrer le patient</>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AddPatientForm;