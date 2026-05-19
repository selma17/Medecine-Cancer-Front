import React from "react";

interface Props {
  distortion: string;
  handleDistortionChange: (value: string) => void;
  showDistortionOptions: boolean;
  distortionOption: string;
  handleDistortionOptionChange: (value: string) => void;
  distortionLocalisation: string;
  handleDistortionLocalisationChange: (value: string) => void;
  hoveredOption: string;
  setHoveredOption: (value: string) => void;
}

const distortionImages: { [key: string]: string } = {
  "centre claire": "/claire.png",
  "centre dense": "/dense.png",
};

const DistortionSection: React.FC<Props> = ({
  distortion,
  handleDistortionChange,
  showDistortionOptions,
  distortionOption,
  handleDistortionOptionChange,
  distortionLocalisation,
  handleDistortionLocalisationChange,
  hoveredOption,
  setHoveredOption,
}) => {
  return (
    <>
      <div className="content">
        <p className="title">Distorsion architecturale</p>
        <div className="options">
          <label className="radio-label">
            <input type="radio" name="distortion" value="oui"
              checked={distortion === "oui"}
              onChange={() => handleDistortionChange("oui")}
            />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="distortion" value="non"
              checked={distortion === "non"}
              onChange={() => handleDistortionChange("non")}
            />
            Non
          </label>
        </div>
      </div>

      {showDistortionOptions && (
        <>
          <div className="content">
            <p className="title">Options de distorsion architecturale</p>
            <div className="options">
              {["centre claire", "centre dense"].map((option) => (
                <div key={option} style={{ position: "relative" }}
                  onMouseEnter={() => setHoveredOption(option)}
                  onMouseLeave={() => setHoveredOption("")}
                >
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="distortionOption"
                      value={option}
                      checked={distortionOption === option}
                      onChange={() => handleDistortionOptionChange(option)}
                    />
                    {option === "centre claire" ? "Centre claire" : "Centre dense"}
                  </label>
                  {hoveredOption === option && distortionImages[option] && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0, zIndex: 100,
                      background: "white", border: "1px solid #e2e8f0",
                      borderRadius: "8px", padding: "6px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)", marginTop: "4px"
                    }}>
                      <img src={distortionImages[option]} alt={option}
                        style={{ width: "160px", height: "120px", objectFit: "cover", borderRadius: "4px" }}
                      />
                      <p style={{ fontSize: "11px", color: "#1B2B6B", textAlign: "center", margin: "4px 0 0", fontWeight: "600" }}>
                        {option}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="content">
            <p className="title">Localisation de la distorsion</p>
            <input
              type="text"
              placeholder="ex: QSE gauche, 10H sein droit..."
              value={distortionLocalisation}
              onChange={(e) => handleDistortionLocalisationChange(e.target.value)}
              className="text-input"
            />
          </div>
        </>
      )}
    </>
  );
};

export default DistortionSection;