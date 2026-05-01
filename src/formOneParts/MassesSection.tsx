import React, { useState } from "react";

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
}

const formesData = [
  { value: "ovale", image: "/forme-ovale.png" },
  { value: "ronde", image: "/forme-ronde.png" },
  { value: "irrégulière", image: "/forme-irreguliere.png" },
];

const contoursData = [
  { value: "circonscrits", image: "/contour-circonscrits.png" },
  { value: "masqués", image: "/contour-masques.png" },
  { value: "microlobulés", image: "/contour-microlobules.png" },
  { value: "indistincts", image: "/contour-indistincts.png" },
  { value: "spiculés", image: "/contour-spicules.png" },
];

const densitesData = [
  { value: "faible", image: "/densite-faible.png" },
  { value: "intermédiaire", image: "/densite-intermediaire.png" },
  { value: "élevée", image: "/densite-elevee.png" },
];

const HoverImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div style={{
    position: "absolute",
    top: "100%",
    left: 0,
    zIndex: 100,
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "6px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    marginTop: "4px"
  }}>
    <img src={src} alt={alt} style={{ width: "160px", height: "120px", objectFit: "cover", borderRadius: "4px" }} />
    <p style={{ fontSize: "11px", color: "#1B2B6B", textAlign: "center", margin: "4px 0 0", fontWeight: "600" }}>{alt}</p>
  </div>
);

const MassesSection: React.FC<Props> = ({
  massNumber, setMassNumber,
  localisations, distancesCentre, seins,
  handleLocalisationChange, handleDistanceCentreChange, handleSeinChange,
  formes, contours, densites, handleMassesDataChange,
}) => {
  const [hoveredItem, setHoveredItem] = useState("");

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

          <div className="content">
            <p className="title">Localisation de la masse {index + 1}</p>
            <input type="text" placeholder="ex: 2H, QSID, UQSD..."
              value={localisations[index] || ""}
              onChange={(e) => handleLocalisationChange(index, e.target.value)}
              className="text-input"
            />
          </div>

          <div className="content">
            <p className="title">Distance du mamelon (cm)</p>
            <input type="text" placeholder="ex: 2"
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
                  <input type="radio" name={`sein-${index}`}
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
              {formesData.map((item) => (
                <div key={item.value} style={{ position: "relative" }}
                  onMouseEnter={() => setHoveredItem(`forme-${index}-${item.value}`)}
                  onMouseLeave={() => setHoveredItem("")}
                >
                  <label className="checkbox-label">
                    <input type="checkbox" value={item.value}
                      checked={formes[index] === item.value}
                      onChange={() => handleMassesDataChange(index, "forme", item.value)}
                    />
                    {item.value}
                  </label>
                  {hoveredItem === `forme-${index}-${item.value}` && (
                    <HoverImage src={item.image} alt={item.value} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contours */}
          <div className="content">
            <p className="title">Contours de la masse {index + 1}</p>
            <div className="options">
              {contoursData.map((item) => (
                <div key={item.value} style={{ position: "relative" }}
                  onMouseEnter={() => setHoveredItem(`contour-${index}-${item.value}`)}
                  onMouseLeave={() => setHoveredItem("")}
                >
                  <label className="checkbox-label">
                    <input type="checkbox" value={item.value}
                      checked={contours[index] === item.value}
                      onChange={() => handleMassesDataChange(index, "contour", item.value)}
                    />
                    {item.value}
                  </label>
                  {hoveredItem === `contour-${index}-${item.value}` && (
                    <HoverImage src={item.image} alt={item.value} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Densité */}
          <div className="content">
            <p className="title">Densité de la masse {index + 1}</p>
            <div className="options">
              {densitesData.map((item) => (
                <div key={item.value} style={{ position: "relative" }}
                  onMouseEnter={() => setHoveredItem(`densite-${index}-${item.value}`)}
                  onMouseLeave={() => setHoveredItem("")}
                >
                  <label className="checkbox-label">
                    <input type="checkbox" value={item.value}
                      checked={densites[index] === item.value}
                      onChange={() => handleMassesDataChange(index, "densite", item.value)}
                    />
                    {item.value}
                  </label>
                  {hoveredItem === `densite-${index}-${item.value}` && (
                    <HoverImage src={item.image} alt={item.value} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MassesSection;