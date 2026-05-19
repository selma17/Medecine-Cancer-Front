import React, { useState } from "react";
import BreastSchema from "../components/BreastSchema";

interface Props {
  index: number;
  localisation: string;
  distanceCentre: string;
  sein: "gauche" | "droite";
  mesure: string;
  forme: string;
  contour: string;
  densite: string;
  orientation: string;
  comportement: string;
  calcification: string;
  onLocalisationChange: (index: number, value: string) => void;
  onDistanceCentreChange: (index: number, value: string) => void;
  onSeinChange: (index: number, value: "gauche" | "droite") => void;
  onMesureChange: (index: number, value: string) => void;
  onMassesDataChange: (
    index: number,
    type: "forme" | "contour" | "densite" | "orientation" | "comportement" | "calcification",
    value: string
  ) => void;
}

const formesData = [
  { value: "ovale", image: "/echo-forme-ovale.png" },
  { value: "ronde", image: "/echo-forme-ronde.png" },
  { value: "irrégulière", image: "/echo-forme-irreguliere.png" },
];

const contoursData = [
  { value: "circonscrits", image: "/echo-contour-circonscrits.png" },
  { value: "indistincts", image: "/echo-contour-indistincts.png" },
  { value: "anguleux", image: "/echo-contour-anguleux.png" },
  { value: "microlobulés", image: "/echo-contour-microlobules.png" },
  { value: "spiculés", image: "/echo-contour-spicules.png" },
];

const orientationsData = [
  { value: "parallèle", image: "/echo-orientation-parallele.png" },
  { value: "non parallèle", image: "/echo-orientation-non-parallele.png" },
];

const echostructuresData = [
  "haute", "isoéchogène", "hypoéchogène", "anéchogène", "complexe",
];

const HoverImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div style={{
    position: "absolute", top: "100%", left: 0, zIndex: 100,
    background: "white", border: "1px solid #e2e8f0",
    borderRadius: "8px", padding: "6px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)", marginTop: "4px"
  }}>
    <img src={src} alt={alt} style={{ width: "160px", height: "120px", objectFit: "cover", borderRadius: "4px" }} />
    <p style={{ fontSize: "11px", color: "#1B2B6B", textAlign: "center", margin: "4px 0 0", fontWeight: "600" }}>{alt}</p>
  </div>
);

const MasseDetailSection: React.FC<Props> = ({
  index, localisation, distanceCentre, sein, mesure,
  forme, contour, densite, orientation, comportement, calcification,
  onLocalisationChange, onDistanceCentreChange, onSeinChange,
  onMesureChange, onMassesDataChange,
}) => {
  const [hoveredItem, setHoveredItem] = useState("");

  const handleRadioChange = (
    type: "forme" | "contour" | "densite" | "orientation" | "comportement" | "calcification",
    value: string
  ) => {
    onMassesDataChange(index, type, value);
  };

  return (
    <div className="additional-section border rounded-lg mt-4 p-4">

      {/* BreastSchema — Montre mammaire */}
      <div className="form-radio-section">
        <p className="form-label">Localisation de la masse {index + 1}</p>
        <BreastSchema
          localisation={localisation}
          distanceCentre={distanceCentre}
          sein={sein}
          onLocalisationChange={(value) => onLocalisationChange(index, value)}
          onDistanceCentreChange={(value) => onDistanceCentreChange(index, value)}
          onSeinChange={(value) => onSeinChange(index, value)}
        />
      </div>

      {/* Mesure */}
      <div className="form-radio-section mt-4">
        <p className="form-label">Mesure {index + 1} (mm)</p>
        <input
          type="text"
          value={mesure}
          onChange={(e) => {
            const val = e.target.value;
            if (/^[\d]*[xX]?[\d]*$/.test(val)) {
              onMesureChange(index, val.toLowerCase());
            }
          }}
          className="form-input"
          placeholder="ex: 15 ou 15x20"
        />
        <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
          Entrez un nombre (ex: 15) ou deux dimensions séparées par x (ex: 15x20)
        </p>
      </div>

      {/* Forme */}
      <div className="form-radio-section mt-4">
        <p className="form-label">Forme <span className="text-red-500 ml-1">*</span></p>
        {formesData.map((item) => (
          <div key={item.value} style={{ position: "relative" }}
            onMouseEnter={() => setHoveredItem(`forme-${item.value}`)}
            onMouseLeave={() => setHoveredItem("")}
          >
            <label className="radio-label">
              <input type="radio" name={`forme-${index}`}
                checked={forme === item.value}
                onChange={() => handleRadioChange("forme", item.value)}
                required
              />
              {item.value}
            </label>
            {hoveredItem === `forme-${item.value}` && <HoverImage src={item.image} alt={item.value} />}
          </div>
        ))}
      </div>

      {/* Contours */}
      <div className="form-radio-section mt-4">
        <p className="form-label">Contours <span className="text-red-500 ml-1">*</span></p>
        {contoursData.map((item) => (
          <div key={item.value} style={{ position: "relative" }}
            onMouseEnter={() => setHoveredItem(`contour-${item.value}`)}
            onMouseLeave={() => setHoveredItem("")}
          >
            <label className="radio-label">
              <input type="radio" name={`contour-${index}`}
                checked={contour === item.value}
                onChange={() => handleRadioChange("contour", item.value)}
                required
              />
              {item.value}
            </label>
            {hoveredItem === `contour-${item.value}` && <HoverImage src={item.image} alt={item.value} />}
          </div>
        ))}
      </div>

      {/* Échostructure */}
      <div className="form-radio-section mt-4">
        <p className="form-label">Échostructure <span className="text-red-500 ml-1">*</span></p>
        {echostructuresData.map((item) => (
          <label key={item} className="radio-label">
            <input type="radio" name={`densite-${index}`}
              checked={densite === item}
              onChange={() => handleRadioChange("densite", item)}
              required
            />
            {item}
          </label>
        ))}
      </div>

      {/* Orientation */}
      <div className="form-radio-section mt-4">
        <p className="form-label">Orientation</p>
        {orientationsData.map((item) => (
          <div key={item.value} style={{ position: "relative" }}
            onMouseEnter={() => setHoveredItem(`orientation-${item.value}`)}
            onMouseLeave={() => setHoveredItem("")}
          >
            <label className="radio-label">
              <input type="radio" name={`orientation-${index}`}
                checked={orientation === item.value}
                onChange={() => handleRadioChange("orientation", item.value)}
              />
              {item.value}
            </label>
            {hoveredItem === `orientation-${item.value}` && <HoverImage src={item.image} alt={item.value} />}
          </div>
        ))}
      </div>

      {/* Comportement */}
      <div className="form-radio-section mt-4">
        <p className="form-label">Comportement</p>
        {["neutre", "renforcement postérieur", "atténuation postérieure", "combiné"].map((comp) => (
          <label key={comp} className="radio-label">
            <input type="radio" name={`comportement-${index}`}
              checked={comportement === comp}
              onChange={() => handleRadioChange("comportement", comp)}
            />
            {comp}
          </label>
        ))}
      </div>

      {/* Calcifications */}
      <div className="form-radio-section mt-4">
        <p className="form-label">Calcifications</p>
        {["dans la masse", "à distance de la masse", "intra-canalaire"].map((calc) => (
          <label key={calc} className="radio-label">
            <input type="radio" name={`calcification-${index}`}
              checked={calcification === calc}
              onChange={() => handleRadioChange("calcification", calc)}
            />
            {calc}
          </label>
        ))}
      </div>

      {localisation && forme && contour && densite ? (
        <div className="mt-4 p-2 bg-green-100 border border-green-300 rounded">
          <p className="text-green-700 text-sm">✅ Masse {index + 1} complète</p>
        </div>
      ) : (
        <div className="mt-4 p-2 bg-orange-100 border border-orange-300 rounded">
          <p className="text-orange-700 text-sm">⚠️ Masse {index + 1} : Remplissez la localisation, forme, contours et échostructure</p>
        </div>
      )}
    </div>
  );
};

export default MasseDetailSection;