import React from "react";

interface Props {
  massNumber: string;
  setMassNumber: (value: string) => void;
  localisations: string[];
  distancesCentre: string[];
  seins: ("gauche" | "droite")[];
  handleLocalisationChange: (index: number, value: string) => void;
  handleDistanceCentreChange: (index: number, value: string) => void;
  handleSeinChange: (index: number, value: "gauche" | "droite") => void;
  formes: string[];
  contours: string[];
  densites: string[];
  handleMassesDataChange: (index: number, type: "forme" | "contour" | "densite", value: string) => void;
  hoveredOption: string;
  setHoveredOption: (value: string) => void;
}

const MassesSection: React.FC<Props> = ({
  massNumber,
  setMassNumber,
  localisations,
  distancesCentre,
  seins,
  handleLocalisationChange,
  handleDistanceCentreChange,
  handleSeinChange,
  formes,
  contours,
  densites,
  handleMassesDataChange,
}) => {

  return (
    <>
      <div className="content">
        <p className="title">Nombre de masse</p>
        <input
          type="number"
          placeholder="Votre réponse"
          value={massNumber}
          onChange={(e) => setMassNumber(e.target.value)}
          className="text-input"
          min="0"
        />
      </div>

      {[...Array(Number(massNumber) || 0)].map((_, index) => (
        <div key={index} className="dynamic-section">
          {/* Schéma mammaire avec localisation */}
          {/* Remplace BreastSchema par des inputs simples */}
          <div className="content">
            <p className="title">Localisation de la masse {index + 1}</p>
            <input
              type="text"
              placeholder="ex: 2H, QSID, UQSD..."
              value={localisations[index] || ""}
              onChange={(e) => handleLocalisationChange(index, e.target.value)}
              className="text-input"
            />
          </div>
          <div className="content">
            <p className="title">Distance du mamelon (cm)</p>
            <input
              type="text"
              placeholder="ex: 2"
              value={distancesCentre[index] || ""}
              onChange={(e) => handleDistanceCentreChange(index, e.target.value)}
              className="text-input"
            />
          </div>
          <div className="content">
            <p className="title">Sein</p>
            <div className="options">
              {["gauche", "droite"].map((s) => (
                <label key={s} className="checkbox-label">
                  <input
                    type="radio"
                    name={`sein-${index}`}
                    checked={seins[index] === s}
                    onChange={() => handleSeinChange(index, s as "gauche" | "droite")}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          {/* Forme */}
          <div className="content">
            <p className="title">Forme de la masse {index + 1}</p>
            <div className="options">
              {["ovale", "ronde", "irrégulière"].map((option) => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={option}
                    checked={formes[index] === option}
                    onChange={() => handleMassesDataChange(index, "forme", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Contours */}
          <div className="content">
            <p className="title">Contours de la masse {index + 1}</p>
            <div className="options">
              {["circonscrits", "masqués", "microlobulés", "indistincts", "spiculés"].map((option) => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={option}
                    checked={contours[index] === option}
                    onChange={() => handleMassesDataChange(index, "contour", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Densité */}
          <div className="content">
            <p className="title">Densité de la masse {index + 1}</p>
            <div className="options">
              {["faible", "intermédiaire", "élevée"].map((option) => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={option}
                    checked={densites[index] === option}
                    onChange={() => handleMassesDataChange(index, "densite", option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MassesSection;
