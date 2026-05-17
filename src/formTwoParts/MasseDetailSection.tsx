import React, { useState } from "react";

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
  { value: "ovale", image: "/forme-ovale.png" },
  { value: "ronde", image: "/forme-ronde.png" },
  { value: "irrégulière", image: "/forme-irreguliere.png" },
];

const contoursData = [
  { value: "circonscrits", image: "/contour-circonscrits.png" },
  { value: "indistincts", image: "/contour-indistincts.png" },
  { value: "anguleux", image: "/iregg.png" },
  { value: "microlobulés", image: "/contour-microlobules.png" },
  { value: "spiculés", image: "/contour-spicules.png" },
];

const densitesData = [
  { value: "haute", image: "/hight.png" },
  { value: "isoéchogène", image: "/equal.png" },
  { value: "hypoéchogène", image: "/low.png" },
  { value: "anéchogène", image: "/opal.png" },
  { value: "complexe", image: "/med.jpg" },
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

      <div className="form-radio-section">
        <p className="form-label">Localisation</p>
        <input type="text" value={localisation}
          onChange={(e) => onLocalisationChange(index, e.target.value)}
          className="form-input" placeholder="ex: 2H, QSID, UQSD..."
        />
      </div>

      <div className="form-radio-section mt-4">
        <p className="form-label">Distance du mamelon (cm)</p>
        <input type="text" value={distanceCentre}
          onChange={(e) => onDistanceCentreChange(index, e.target.value)}
          className="form-input" placeholder="ex: 2"
        />
      </div>

      <div className="form-radio-section mt-4">
        <p className="form-label">Sein</p>
        {["gauche", "droite"].map((s) => (
          <label key={s} className="radio-label">
            <input type="radio" name={`sein-${index}`}
              checked={sein === s}
              onChange={() => onSeinChange(index, s as "gauche" | "droite")}
            />
            {s}
          </label>
        ))}
      </div>

      <div className="form-radio-section mt-4">
        <p className="form-label">Mesure {index + 1} (mm)</p>
        <input type="text" value={mesure}
          onChange={(e) => onMesureChange(index, e.target.value)}
          className="form-input" placeholder="ex: 15x20"
        />
      </div>

      {/* Forme */}
      <div className="form-radio-section mt-4">
        <p className="form-label">Forme de la masse <span className="text-red-500 ml-1">*</span></p>
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
            {hoveredItem === `forme-${item.value}` && (
              <HoverImage src={item.image} alt={item.value} />
            )}
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
            {hoveredItem === `contour-${item.value}` && (
              <HoverImage src={item.image} alt={item.value} />
            )}
          </div>
        ))}
      </div>

      {/* Densité */}
      <div className="form-radio-section mt-4">
        <p className="form-label">Densité <span className="text-red-500 ml-1">*</span></p>
        {densitesData.map((item) => (
          <div key={item.value} style={{ position: "relative" }}
            onMouseEnter={() => setHoveredItem(`densite-${item.value}`)}
            onMouseLeave={() => setHoveredItem("")}
          >
            <label className="radio-label">
              <input type="radio" name={`densite-${index}`}
                checked={densite === item.value}
                onChange={() => handleRadioChange("densite", item.value)}
                required
              />
              {item.value}
            </label>
            {hoveredItem === `densite-${item.value}` && (
              <HoverImage src={item.image} alt={item.value} />
            )}
          </div>
        ))}
      </div>

      {/* Orientation */}
      <div className="form-radio-section mt-4">
        <p className="form-label">Orientation</p>
        {["parallèle", "non parallèle"].map((o) => (
          <label key={o} className="radio-label">
            <input type="radio" name={`orientation-${index}`}
              checked={orientation === o}
              onChange={() => handleRadioChange("orientation", o)}
            />
            {o}
          </label>
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
          <p className="text-orange-700 text-sm">⚠️ Masse {index + 1} : Remplissez la localisation, forme, contours et densité</p>
        </div>
      )}
    </div>
  );
};

export default MasseDetailSection;