import React from "react";

interface CalcificationItem {
  value: string;
  image: string;
}

interface Props {
  calcifications: string;
  handleCalcificationsChange: (value: string) => void;
  typeCalcification: string;
  handleTypeCalcificationChange: (value: string) => void;
  benigneSelected: string[];
  handleBenigneCheckboxChange: (value: string) => void;
  suspecteSelected: string[];
  handleSuspecteCheckboxChange: (value: string) => void;
  hoveredCalcificationOption: string;
  setHoveredCalcificationOption: (value: string) => void;
  handleCalcificationLeave: () => void;
  distributionMicrocalcifications: string[];
  handleDistributionChange: (value: string) => void;
  calcificationLocalisation: string;
  handleCalcificationLocalisationChange: (value: string) => void;
}

const benigneCalcifications: CalcificationItem[] = [
  { value: "cutanées", image: "/skin.png" },
  { value: "vasculaires", image: "/vasculaire.png" },
  { value: "en pop corn", image: "/pop.png" },
  { value: "lait calcique", image: "/milk.png" },
  { value: "mastite à plasmocyte", image: "/rod.png" },
  { value: "dystrophique", image: "/dist.png" },
  { value: "coquille d'oeuf", image: "/rim.png" },
  { value: "punctiformes", image: "/punct.png" },
  { value: "rondes", image: "/roundd.png" },
];

const suspecteCalcifications: CalcificationItem[] = [
  { value: "amorphes", image: "/dcis.png" },
  { value: "grossières hétérogènes", image: "/coar.png" },
  { value: "fines pléomorphes", image: "/fine.png" },
  { value: "fines linéaires ou fines linéaires branchés", image: "/branch.png" },
];

const distributionOptions: CalcificationItem[] = [
  { value: "diffuses", image: "/dist-diffuse.png" },
  { value: "régionales", image: "/dist-regional.png" },
  { value: "segmentaires", image: "/dist-segmental.png" },
  { value: "groupées", image: "/dist-groupe.png" },
  { value: "linéaires", image: "/dist-groupe.png" },
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

const CalcificationSection: React.FC<Props> = ({
  calcifications = "non",
  handleCalcificationsChange,
  typeCalcification = "",
  handleTypeCalcificationChange,
  benigneSelected = [],
  handleBenigneCheckboxChange,
  suspecteSelected = [],
  handleSuspecteCheckboxChange,
  hoveredCalcificationOption,
  setHoveredCalcificationOption,
  handleCalcificationLeave,
  distributionMicrocalcifications = [],
  handleDistributionChange,
  calcificationLocalisation,
  handleCalcificationLocalisationChange,
}) => {
  return (
    <div className="calcification-section">
      <div className="section">
        <h3 className="section-title">Calcifications</h3>
        <div className="radio-group">
          {["oui", "non"].map((option) => (
            <label key={option} className="radio-label">
              <input
                type="radio" name="calcifications" value={option}
                checked={calcifications === option}
                onChange={() => handleCalcificationsChange(option)}
              />
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {calcifications === "oui" && (
        <>
          {/* Localisation des calcifications */}
          <div className="section">
            <h3 className="section-title">Localisation des calcifications</h3>
            <input
              type="text"
              placeholder="ex: QSE gauche, QII droit, 3H sein gauche..."
              value={calcificationLocalisation}
              onChange={(e) => handleCalcificationLocalisationChange(e.target.value)}
              className="text-input"
            />
          </div>

          <div className="section">
            <h3 className="section-title">Types de calcifications</h3>
            <div className="radio-group">
              {["bénigne", "suspecte"].map((type) => (
                <label key={type} className="radio-label">
                  <input
                    type="radio" name="typeCalcification" value={type}
                    checked={typeCalcification === type}
                    onChange={() => handleTypeCalcificationChange(type)}
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {typeCalcification === "bénigne" && (
            <div className="section">
              <h3 className="section-title">Calcifications bénignes</h3>
              <div className="checkbox-grid">
                {benigneCalcifications.map((item) => (
                  <div key={item.value} className="checkbox-item" style={{ position: "relative" }}
                    onMouseEnter={() => setHoveredCalcificationOption(item.value)}
                    onMouseLeave={handleCalcificationLeave}
                  >
                    <label className="checkbox-label">
                      <input type="checkbox"
                        checked={benigneSelected.includes(item.value)}
                        onChange={() => handleBenigneCheckboxChange(item.value)}
                      />
                      <span>{item.value}</span>
                    </label>
                    {hoveredCalcificationOption === item.value && (
                      <HoverImage src={item.image} alt={item.value} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {typeCalcification === "suspecte" && (
            <>
              <div className="section">
                <h3 className="section-title">Calcifications suspectes</h3>
                <div className="checkbox-grid">
                  {suspecteCalcifications.map((item) => (
                    <div key={item.value} className="checkbox-item" style={{ position: "relative" }}
                      onMouseEnter={() => setHoveredCalcificationOption(item.value)}
                      onMouseLeave={handleCalcificationLeave}
                    >
                      <label className="checkbox-label">
                        <input type="checkbox"
                          checked={suspecteSelected.includes(item.value)}
                          onChange={() => handleSuspecteCheckboxChange(item.value)}
                        />
                        <span>{item.value}</span>
                      </label>
                      {hoveredCalcificationOption === item.value && (
                        <HoverImage src={item.image} alt={item.value} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {suspecteSelected.length > 0 && (
                <div className="section">
                  <h3 className="section-title">Distribution des microcalcifications</h3>
                  <div className="checkbox-grid">
                    {distributionOptions.map((item) => (
                      <div key={item.value} className="checkbox-item" style={{ position: "relative" }}
                        onMouseEnter={() => setHoveredCalcificationOption(`dist-${item.value}`)}
                        onMouseLeave={handleCalcificationLeave}
                      >
                        <label className="checkbox-label">
                          <input type="checkbox"
                            checked={distributionMicrocalcifications.includes(item.value)}
                            onChange={() => handleDistributionChange(item.value)}
                          />
                          {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                        </label>
                        {hoveredCalcificationOption === `dist-${item.value}` && (
                          <HoverImage src={item.image} alt={item.value} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CalcificationSection;