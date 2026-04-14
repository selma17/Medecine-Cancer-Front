import React from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "./steppper/Stepper";
import DensiteSection from "./formOneParts/DensiteSection";
import MassesSection from "./formOneParts/MassesSection";
import AsymmetrySection from "./formOneParts/AsymmetrySection";
import DistortionSection from "./formOneParts/DistortionSection";
import CalcificationSection from "./formOneParts/CalcificationSection";
import SignsSection from "./formOneParts/SignsSection";
import NextButton from "./formOneParts/NextButton";
import { useFormOneLogic } from "./formOneParts/useFormOneLogic";

const FormOne: React.FC = () => {
  const navigate = useNavigate();
  const logic = useFormOneLogic(navigate);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EEF2F7", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Sidebar mini */}
      <aside style={{ width: "64px", background: "#1B2B6B", display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem 0", flexShrink: 0 }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2C9 2 7 4 7 6.5c0 2 1.5 3.5 3 5L12 13l2-1.5c1.5-1.5 3-3 3-5C17 4 15 2 12 2z"/>
            <path d="M12 13l-4 6c-.5 1 0 2 1 2s1.5-.5 3-2l0 0c1.5 1.5 2 2 3 2s1.5-1 1-2l-4-6z"/>
          </svg>
        </div>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", padding: "8px", borderRadius: "8px" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <header style={{ background: "white", padding: "1rem 2rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "600", color: "#1B2B6B", margin: 0 }}>Saisie de l'examen</h1>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Remplissez les données de l'examen mammographique</p>
          </div>
        </header>

        {/* Body */}
        <main style={{ padding: "2rem", flex: 1, overflowY: "auto" }}>

          {/* Stepper */}
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.25rem 2rem", marginBottom: "1.5rem" }}>
            <Stepper steps={logic.steps} currentStep={0} />
          </div>

          {/* Form card */}
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>

            {/* Form header */}
            <div style={{ background: "#1B2B6B", padding: "1.25rem 2rem", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
              </div>
              <div>
                <h2 style={{ color: "white", fontSize: "16px", fontWeight: "600", margin: 0 }}>Mammographie</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: 0 }}>Étape 1 sur 3</p>
              </div>
            </div>

            {/* Form sections */}
            <div style={{ padding: "2rem" }} className="mammographie-form-content">
              <DensiteSection
                selected={logic.selected}
                hoveredOption={logic.hoveredOption}
                setHoveredOption={logic.setHoveredOption}
                handleCheckboxChange={logic.handleCheckboxChange}
              />
              <MassesSection
                massNumber={logic.massNumber}
                setMassNumber={logic.setMassNumber}
                localisations={logic.localisations}
                distancesCentre={logic.distancesCentre}
                seins={logic.seins}
                handleLocalisationChange={logic.handleLocalisationChange}
                handleDistanceCentreChange={logic.handleDistanceCentreChange}
                handleSeinChange={logic.handleSeinChange}
                hoveredOption={logic.hoveredOption}
                setHoveredOption={logic.setHoveredOption}
                formes={logic.formes}
                contours={logic.contours}
                densites={logic.densites}
                handleMassesDataChange={logic.handleMassesDataChange}
              />
              <AsymmetrySection
                asymmetry={logic.asymmetry}
                handleAsymmetryChange={logic.handleAsymmetryChange}
                asymmetryDetails={logic.asymmetryDetails}
                handleAsymmetryDetailsChange={logic.handleAsymmetryDetailsChange}
              />
              <DistortionSection
                distortion={logic.distortion}
                handleDistortionChange={logic.handleDistortionChange}
                showDistortionOptions={logic.showDistortionOptions}
                hoveredOption={logic.hoveredOption}
                setHoveredOption={logic.setHoveredOption}
              />
              <CalcificationSection
                calcifications={logic.calcifications}
                handleCalcificationsChange={logic.handleCalcificationsChange}
                typeCalcification={logic.typeCalcification}
                handleTypeCalcificationChange={logic.handleTypeCalcificationChange}
                benigneSelected={logic.benigneSelected}
                handleBenigneCheckboxChange={logic.handleBenigneCheckboxChange}
                suspecteSelected={logic.suspecteSelected}
                handleSuspecteCheckboxChange={logic.handleSuspecteCheckboxChange}
                hoveredCalcificationOption={logic.hoveredCalcificationOption}
                setHoveredCalcificationOption={logic.setHoveredCalcificationOption}
                handleCalcificationLeave={logic.handleCalcificationLeave}
                distributionMicrocalcifications={logic.distributionMicrocalcifications}
                handleDistributionChange={logic.handleDistributionChange}
              />
              <SignsSection
                signsAssociated={logic.signsAssociated}
                handleSignsAssociatedChange={logic.handleSignsAssociatedChange}
              />
            </div>

            {/* Footer with next button */}
            <div style={{ padding: "1.25rem 2rem", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={logic.handleNextClick}
                style={{ padding: "10px 28px", background: "#1B2B6B", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontFamily: "inherit" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#243d8f"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#1B2B6B"}
              >
                Suivant
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .mammographie-form-content .content { margin-bottom: 1.5rem; }
        .mammographie-form-content .title { font-size: 14px; font-weight: 600; color: #1B2B6B; margin-bottom: 10px; }
        .mammographie-form-content .options { display: flex; flex-wrap: wrap; gap: 8px; }
        .mammographie-form-content .checkbox-label {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px; border: 1px solid #e2e8f0;
          border-radius: 8px; cursor: pointer; font-size: 13px;
          color: #1e293b; transition: all 0.15s; background: white;
        }
        .mammographie-form-content .checkbox-label:hover { border-color: #1B2B6B; background: #EEF2F7; }
        .mammographie-form-content .checkbox-label input { accent-color: #1B2B6B; }
        .mammographie-form-content .radio-label {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px; border: 1px solid #e2e8f0;
          border-radius: 8px; cursor: pointer; font-size: 13px;
          color: #1e293b; transition: all 0.15s; background: white;
        }
        .mammographie-form-content .radio-label:hover { border-color: #1B2B6B; background: #EEF2F7; }
        .mammographie-form-content .text-input {
          width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0;
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: inherit; box-sizing: border-box;
        }
        .mammographie-form-content .text-input:focus { border-color: #1B2B6B; }
        .mammographie-form-content .dynamic-section {
          background: #F8FAFC; border-radius: 12px;
          padding: 1.25rem; margin-top: 1rem;
          border: 1px solid #e2e8f0;
        }
        .mammographie-form-content .image-preview img {
          max-width: 150px; border-radius: 8px;
          margin-top: 8px; border: 1px solid #e2e8f0;
        }
        .mammographie-form-content .section { margin-bottom: 1.25rem; }
        .mammographie-form-content .section-title { font-size: 13px; font-weight: 600; color: #1B2B6B; margin-bottom: 8px; }
        .mammographie-form-content .checkbox-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .mammographie-form-content .checkbox-item { position: relative; }
        .mammographie-form-content .checkbox-group { display: flex; flex-wrap: wrap; gap: 8px; }
        .mammographie-form-content .radio-group { display: flex; flex-wrap: wrap; gap: 8px; }
        .mammographie-form-content .additional-content img { max-width: 150px; border-radius: 8px; margin-top: 8px; }
        @media (max-width: 768px) {
          main { padding: 1rem !important; }
          aside { display: none; }
        }
      `}</style>
    </div>
  );
};

export default FormOne;