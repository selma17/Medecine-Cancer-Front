import React from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "./steppper/Stepper";
import { useFormTwoLogic } from "./formTwoParts/useFormTwoLogic";
import EchostructureMammaireSection from "./formTwoParts/EchostructureMammaireSection";
import NombreMasseSection from "./formTwoParts/NombreMasseSection";
import MasseDetailSection from "./formTwoParts/MasseDetailSection";
import SignesAssociesSection from "./formTwoParts/SignesAssociesSection";
import CasSpeciauxSection from "./formTwoParts/CasSpeciauxSection";

const FormTwo: React.FC = () => {
  const navigate = useNavigate();
  const logic = useFormTwoLogic(navigate);

  return (
    <>
      <style>{`
        .form2-page {
          min-height: 100vh;
          background: #EEF2F7;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-y: auto !important;
        }
        .form2-topbar {
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
        .form2-body {
          max-width: 720px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .form2-stepper-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 1.25rem 2rem;
          margin-bottom: 1.5rem;
        }
        .form2-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .form2-card-header {
          background: #1B2B6B;
          padding: 1.25rem 1.75rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .form2-card-body { padding: 1.75rem; }
        .form2-footer {
          padding: 1.25rem 1.75rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
        }
        .form2-next-btn {
          padding: 10px 28px;
          background: #1B2B6B;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          transition: background 0.2s;
        }
        .form2-next-btn:hover { background: #243d8f; }
        .form2-card-body .additional-section {
          background: #F8FAFC;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          border: 1px solid #e2e8f0;
        }
        .form2-card-body .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #1B2B6B;
          margin-bottom: 10px;
          display: block;
        }
        .form2-card-body .form-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          box-sizing: border-box;
          margin-top: 6px;
        }
        .form2-card-body .form-input:focus { border-color: #1B2B6B; }
        .form2-card-body .radio-label, 
        .form2-card-body .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          color: #1e293b;
          transition: all 0.15s;
          background: white;
          margin-bottom: 6px;
          width: 100%;
          box-sizing: border-box;
        }
        .form2-card-body .radio-label:hover,
        .form2-card-body .checkbox-label:hover {
          border-color: #1B2B6B;
          background: #EEF2F7;
        }
        .form2-card-body .radio-label input,
        .form2-card-body .checkbox-label input {
          accent-color: #1B2B6B;
        }
        .form2-card-body .form-radio-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 8px;
        }
        .form2-card-body .input-field {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 13px;
          outline: none;
          font-family: inherit;
          box-sizing: border-box;
          margin-top: 6px;
        }
        .form2-card-body .input-field:focus { border-color: #1B2B6B; }
        .form2-card-body .text-red-500 { color: #e11d48; }
        .form2-card-body .text-red-600 { color: #dc2626; font-size: 12px; margin-top: 4px; display: block; }
        .form2-card-body .text-green-600 { color: #16a34a; font-size: 12px; margin-top: 4px; display: block; }
        .form2-card-body .text-orange-600 { color: #ea580c; font-size: 12px; margin-top: 4px; display: block; }
        .form2-card-body .text-orange-700 { color: #c2410c; font-size: 12px; }
        .form2-card-body .text-green-700 { color: #15803d; font-size: 12px; }
        .form2-card-body .bg-orange-100 { background: #FFF7ED; border: 1px solid #fed7aa; border-radius: 8px; padding: 10px 14px; margin-top: 10px; }
        .form2-card-body .bg-green-100 { background: #F0FDF4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; margin-top: 10px; }
        .form2-card-body .border { border: 1px solid #e2e8f0; }
        .form2-card-body .rounded-lg { border-radius: 8px; }
        .form2-card-body .mt-2 { margin-top: 8px; }
        .form2-card-body .mt-4 { margin-top: 16px; }
        .form2-card-body .mt-6 { margin-top: 24px; }
        .form2-card-body .mb-2 { margin-bottom: 8px; }
        .form2-card-body .mb-4 { margin-bottom: 16px; }
        .form2-card-body .ml-4 { margin-left: 16px; }
        .form2-card-body .ml-1 { margin-left: 4px; }
        .form2-card-body .p-2 { padding: 8px; }
        .form2-card-body .p-4 { padding: 16px; }
        .form2-card-body .block { display: block; }
        .form2-card-body .text-sm { font-size: 12px; }
        .form2-card-body .bg-section { background: #F8FAFC; }
        @media (max-width: 1024px) { .form2-body { max-width: 90%; } }
        @media (max-width: 768px) { .form2-body { padding: 1rem; max-width: 100%; } }
      `}</style>

      <div className="form2-page">
        <div className="form2-topbar">
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "14px", fontFamily: "inherit", padding: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Retour
          </button>
          <div style={{ width: "1px", height: "20px", background: "#e2e8f0" }}/>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="/logo-octobre-rose.png"
              alt="Logo"
              style={{ width: "28px", height: "28px", objectFit: "contain", borderRadius: "6px" }}
            />
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#1B2B6B" }}>Breast AI Report</span>
          </div>
        </div>

        <div className="form2-body">
          <div className="form2-stepper-card">
            <Stepper steps={logic.steps} currentStep={1} />
          </div>

          <div className="form2-card">
            <div className="form2-card-header">
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <div>
                <h2 style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0 }}>Échographie mammaire</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: 0 }}>Étape 2 sur 3</p>
              </div>
            </div>

            <div className="form2-card-body">
              <EchostructureMammaireSection
                echostructureMammaire={logic.echostructureMammaire || ""}
                handleEchostructureChange={logic.handleEchostructureChange}
              />
              <NombreMasseSection
                nombreMasse={logic.nombreMasse}
                handleNombreMasseChange={logic.handleNombreMasseChange}
              />
              {new Array(Number(logic.nombreMasse) || 0).fill(0).map((_, index) => (
                <MasseDetailSection
                  key={index}
                  index={index}
                  localisation={logic.localisations[index] || ""}
                  distanceCentre={logic.distancesCentre[index] || ""}
                  sein={logic.seins[index] || "gauche"}
                  mesure={logic.mesures[index] || ""}
                  forme={logic.formes[index] || ""}
                  contour={logic.contours[index] || ""}
                  densite={logic.densites[index] || ""}
                  orientation={logic.orientations[index] || ""}
                  comportement={logic.comportements[index] || ""}
                  calcification={logic.calcifications[index] || ""}
                  onLocalisationChange={logic.handleLocalisationChange}
                  onDistanceCentreChange={logic.handleDistanceCentreChange}
                  onSeinChange={logic.handleSeinChange}
                  onMesureChange={logic.handleMesureChange}
                  onMassesDataChange={logic.handleMassesDataChange}
                />
              ))}
              <SignesAssociesSection
                signesAssocies={logic.signesAssocies}
                handleSignesAssociesChange={logic.handleSignesAssociesChange}
              />
              <CasSpeciauxSection
                casSpeciaux={logic.casSpeciaux}
                handleCasSpeciauxChange={logic.handleCasSpeciauxChange}
                localisations={logic.casSpeciauxLocalisations}
                handleLocalisationChange={logic.handleCasSpeciauxLocalisationChange}
              />
            </div>

            <div className="form2-footer">
              <button className="form2-next-btn" onClick={logic.handleNextClick}>
                Suivant
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormTwo;