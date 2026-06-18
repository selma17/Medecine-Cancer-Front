import React, { useState } from "react";
import BreastSchema from "../components/BreastSchema";

interface Props {
  index: number;
  localisation: string;
  distanceCentre: string;
  rayonHoraire: string;
  sein: "gauche" | "droit";
  mesure: string;
  forme: string;
  contour: string;
  densite: string;
  orientation: string;
  comportement: string;
  calcification: string;
  onLocalisationChange: (index: number, value: string) => void;
  onDistanceCentreChange: (index: number, value: string) => void;
  onRayonHoraireChange: (index: number, value: string) => void;
  onSeinChange: (index: number, value: "gauche" | "droit") => void;
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
  { value: "parallèle", image: "/echo-orientation-non-parallele.png" },
  { value: "non parallèle", image: "/echo-orientation-parallele.png" },
];

const echostructuresData = [
  { value: "haute", image: "/echo-struct-haute.png" },
  { value: "isoéchogène", image: "/echo-struct-isoechogene.png" },
  { value: "hypoéchogène", image: "/echo-struct-hypoechogene.png" },
  { value: "anéchogène", image: "/echo-struct-anechogene.png" },
  { value: "complexe", image: "/echo-struct-complexe.png" },
];

const comportementsData = [
  { value: "neutre", image: "/echo-comport-neutre.png" },
  { value: "renforcement postérieur", image: "/echo-comport-renforcement.png" },
  { value: "atténuation postérieure", image: "/echo-comport-attenuation.png" },
  { value: "combiné", image: "/echo-comport-combine.png" },
];

const calcificationsEchoData = [
  { value: "dans la masse", image: "/echo-calcif-dans-masse.png" },
  { value: "à distance de la masse", image: "/echo-calcif-distance.png" },
  { value: "intra-canalaire", image: "/echo-calcif-intracanalaire.png" },
];

const HoverImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div style={{
    position: "absolute",
    top: 0,
    left: "calc(100% + 12px)",
    zIndex: 100,
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "6px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  }}>
    <img src={src} alt={alt} style={{ width: "220px", height: "180px", objectFit: "cover", borderRadius: "4px" }} />
    <p style={{ fontSize: "11px", color: "#1B2B6B", textAlign: "center", margin: "4px 0 0", fontWeight: "600" }}>{alt}</p>
  </div>
);

const MasseDetailSection: React.FC<Props> = ({
  index, localisation, distanceCentre, rayonHoraire, sein, mesure,
  forme, contour, densite, orientation, comportement, calcification,
  onLocalisationChange, onDistanceCentreChange, onRayonHoraireChange, onSeinChange,
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
          rayonHoraire={rayonHoraire}
          sein={sein}
          onLocalisationChange={(value) => onLocalisationChange(index, value)}
          onDistanceCentreChange={(value) => onDistanceCentreChange(index, value)}
          onRayonHoraireChange={(value) => onRayonHoraireChange(index, value)}
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
            {hoveredItem === `densite-${item.value}` && <HoverImage src={item.image} alt={item.value} />}
          </div>
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
        {comportementsData.map((item) => (
          <div key={item.value} style={{ position: "relative" }}
            onMouseEnter={() => setHoveredItem(`comportement-${item.value}`)}
            onMouseLeave={() => setHoveredItem("")}
          >
            <label className="radio-label">
              <input type="radio" name={`comportement-${index}`}
                checked={comportement === item.value}
                onChange={() => handleRadioChange("comportement", item.value)}
              />
              {item.value}
            </label>
            {hoveredItem === `comportement-${item.value}` && <HoverImage src={item.image} alt={item.value} />}
          </div>
        ))}
      </div>

      {/* Calcifications */}
      <div className="form-radio-section mt-4">
        <p className="form-label">Calcifications</p>
        {calcificationsEchoData.map((item) => (
          <div key={item.value} style={{ position: "relative" }}
            onMouseEnter={() => setHoveredItem(`calcification-${item.value}`)}
            onMouseLeave={() => setHoveredItem("")}
          >
            <label className="radio-label">
              <input type="radio" name={`calcification-${index}`}
                checked={calcification === item.value}
                onChange={() => handleRadioChange("calcification", item.value)}
              />
              {item.value}
            </label>
            {hoveredItem === `calcification-${item.value}` && <HoverImage src={item.image} alt={item.value} />}
          </div>
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