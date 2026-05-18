import React from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "./steppper/Stepper";
import DensiteSection from "./formOneParts/DensiteSection";
import MassesSection from "./formOneParts/MassesSection";
import AsymmetrySection from "./formOneParts/AsymmetrySection";
import DistortionSection from "./formOneParts/DistortionSection";
import CalcificationSection from "./formOneParts/CalcificationSection";
import SignsSection from "./formOneParts/SignsSection";
import { useFormOneLogic } from "./formOneParts/useFormOneLogic";

const FormOne: React.FC = () => {
  const navigate = useNavigate();
  const logic = useFormOneLogic(navigate);

  return (
    <>
      <style>{`
        .form1-page {
          min-height: 100vh;
          background: #EEF2F7;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-y: auto !important;
          overflow-x: hidden;
        }
        .form1-topbar {
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
        .form1-body {
          max-width: 720px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .form1-stepper-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 1.25rem 2rem;
          margin-bottom: 1.5rem;
        }
        .form1-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: visible;
          margin-bottom: 1.5rem;
        }
        .form1-card-header {
          background: #1B2B6B;
          padding: 1.25rem 1.75rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .form1-card-header-icon {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
        }
        .form1-card-body { padding: 1.75rem; }
        .form1-footer {
          padding: 1.25rem 1.75rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
        }
        .form1-next-btn {
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
        .form1-next-btn:hover { background: #243d8f; }
        .form1-card-body .content { margin-bottom: 1.5rem; }
        .form1-card-body .title {
          font-size: 14px; font-weight: 600;
          color: #1B2B6B; margin-bottom: 10px;
        }
        .form1-card-body .options { display: flex; flex-wrap: wrap; gap: 8px; }
        .form1-card-body .checkbox-label {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px; border: 1px solid #e2e8f0;
          border-radius: 8px; cursor: pointer; font-size: 13px;
          color: #1e293b; transition: all 0.15s; background: white;
        }
        .form1-card-body .checkbox-label:hover { border-color: #1B2B6B; background: #EEF2F7; }
        .form1-card-body .checkbox-label input { accent-color: #1B2B6B; }
        .form1-card-body .radio-label {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px; border: 1px solid #e2e8f0;
          border-radius: 8px; cursor: pointer; font-size: 13px;
          color: #1e293b; transition: all 0.15s; background: white;
        }
        .form1-card-body .radio-label:hover { border-color: #1B2B6B; background: #EEF2F7; }
        .form1-card-body .text-input {
          width: 100%; padding: 10px 14px;
          border: 1px solid #e2e8f0; border-radius: 8px;
          font-size: 14px; outline: none;
          font-family: inherit; box-sizing: border-box;
        }
        .form1-card-body .text-input:focus { border-color: #1B2B6B; }
        .form1-card-body .dynamic-section {
          background: #F8FAFC; border-radius: 12px;
          padding: 1.25rem; margin-top: 1rem;
          border: 1px solid #e2e8f0;
        }
        .form1-card-body .section { margin-bottom: 1.25rem; }
        .form1-card-body .section-title {
          font-size: 13px; font-weight: 600;
          color: #1B2B6B; margin-bottom: 8px;
        }
        .form1-card-body .checkbox-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .form1-card-body .checkbox-item { position: relative; }
        .form1-card-body .checkbox-group { display: flex; flex-wrap: wrap; gap: 8px; }
        .form1-card-body .radio-group { display: flex; flex-wrap: wrap; gap: 8px; }
        .form1-card-body .calcification-section {}
        @media (max-width: 768px) {
          .form1-body { padding: 1rem; }
          .form1-card-body { padding: 1.25rem; }
        }
      `}</style>

      <div className="form1-page">
        <div className="form1-topbar">
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

        <div className="form1-body">
          <div className="form1-stepper-card">
            <Stepper steps={logic.steps} currentStep={0} />
          </div>

          <div className="form1-card">
            <div className="form1-card-header">
              <div className="form1-card-header-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
              </div>
              <div>
                <h2 style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0 }}>Mammographie</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: 0 }}>Étape 1 sur 3</p>
              </div>
            </div>

            <div className="form1-card-body">
              <DensiteSection
                selected={logic.selected}
                hoveredOption={logic.hoveredOption}
                setHoveredOption={logic.setHoveredOption}
                handleCheckboxChange={logic.handleCheckboxChange}
              />

              {/* ✅ MassesSection — sans distancesCentre */}
              <MassesSection
                massNumber={logic.massNumber}
                setMassNumber={logic.setMassNumber}
                localisations={logic.localisations}
                seins={logic.seins}
                handleLocalisationChange={logic.handleLocalisationChange}
                handleSeinChange={logic.handleSeinChange}
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

              {/* ✅ DistortionSection — avec les 2 nouvelles props */}
              <DistortionSection
                distortion={logic.distortion}
                handleDistortionChange={logic.handleDistortionChange}
                showDistortionOptions={logic.showDistortionOptions}
                distortionOption={logic.distortionOption}
                handleDistortionOptionChange={logic.handleDistortionOptionChange}
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

            <div className="form1-footer">
              <button className="form1-next-btn" onClick={logic.handleNextClick}>
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

export default FormOne;