import React from "react";

interface Props {
  selected: string[];
  hoveredOption: string;
  setHoveredOption: (value: string) => void;
  handleCheckboxChange: (value: string) => void;
}

const densiteImages: { [key: string]: string } = {
  "A": "/A.png",
  "B": "/B.png",
  "C": "/C.png",
  "D": "/D.png",
};

const DensiteSection: React.FC<Props> = ({
  selected,
  hoveredOption,
  setHoveredOption,
  handleCheckboxChange,
}) => {
  return (
    <div className="content">
      <p className="title">Densité mammaire</p>
      <div className="options" style={{ flexWrap: "wrap" }}>
        {["A", "B", "C", "D"].map((option) => (
          <div
            key={option}
            style={{ position: "relative" }}
            onMouseEnter={() => setHoveredOption(option)}
            onMouseLeave={() => setHoveredOption("")}
          >
            <label className="checkbox-label">
              <input
                type="radio"
                name="densiteMammaire"
                value={option}
                checked={selected.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              {option}
            </label>
            {hoveredOption === option && densiteImages[option] && (
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
                <img
                  src={densiteImages[option]}
                  alt={`Densité ${option}`}
                  style={{ width: "220px", height: "200px", objectFit: "cover", borderRadius: "4px" }}
                />
                <p style={{ fontSize: "11px", color: "#1B2B6B", textAlign: "center", margin: "4px 0 0", fontWeight: "600" }}>
                  Densité {option}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DensiteSection;