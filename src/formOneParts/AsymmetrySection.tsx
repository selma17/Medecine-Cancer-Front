import React from "react";

interface Props {
  asymmetry: string;
  handleAsymmetryChange: (value: string) => void;
  asymmetryDetails: string[];
  handleAsymmetryDetailsChange: (value: string) => void;
  asymmetryLocalisation: string;
  handleAsymmetryLocalisationChange: (value: string) => void;
}

const AsymmetrySection: React.FC<Props> = ({
  asymmetry,
  handleAsymmetryChange,
  asymmetryDetails,
  handleAsymmetryDetailsChange,
  asymmetryLocalisation,
  handleAsymmetryLocalisationChange,
}) => {
  return (
    <>
      <div className="content">
        <p className="title">Asymétrie</p>
        <div className="options">
          <label className="checkbox-label">
            <input type="radio" name="asymmetry" value="oui"
              checked={asymmetry === "oui"}
              onChange={() => handleAsymmetryChange("oui")}
            />
            Oui
          </label>
          <label className="checkbox-label">
            <input type="radio" name="asymmetry" value="non"
              checked={asymmetry === "non"}
              onChange={() => handleAsymmetryChange("non")}
            />
            Non
          </label>
        </div>
      </div>

      {asymmetry === "oui" && (
        <>
          <div className="content">
            <p className="title">Asymétrie détails</p>
            <div className="options">
              {["asymétrie", "globale", "focale", "évolutive"].map((option) => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={option}
                    checked={asymmetryDetails.includes(option)}
                    onChange={() => handleAsymmetryDetailsChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="content">
            <p className="title">Localisation de l'asymétrie</p>
            <input
              type="text"
              placeholder="ex: QSE gauche, QSID droit..."
              value={asymmetryLocalisation}
              onChange={(e) => handleAsymmetryLocalisationChange(e.target.value)}
              className="text-input"
            />
          </div>
        </>
      )}
    </>
  );
};

export default AsymmetrySection;