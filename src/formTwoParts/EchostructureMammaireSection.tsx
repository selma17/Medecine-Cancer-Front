import React, { useState } from "react";

interface Props {
  echostructureMammaire: string;
  handleEchostructureChange: (value: string) => void;
}

const echostructureData = [
  { value: "graisseuse homogène", image: "/echostructure-graisseuse.png" },
  { value: "fibroglandulaire homogène", image: "/echostructure-fibroglandulaire.png" },
  { value: "hétérogène", image: "/echostructure-heterogene.png" },
];

const EchostructureMammaireSection: React.FC<Props> = ({ 
  echostructureMammaire, 
  handleEchostructureChange 
}) => {
  const [hoveredItem, setHoveredItem] = useState("");

  return (
    <div className="additional-section border rounded-lg mt-4 p-4">
      <label className="form-label">
        Échostructure mammaire 
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="form-radio-section mt-2">
        {echostructureData.map((item) => (
          <div key={item.value} style={{ position: "relative" }}
            onMouseEnter={() => setHoveredItem(item.value)}
            onMouseLeave={() => setHoveredItem("")}
          >
            <label className="radio-label">
              <input
                type="radio"
                name="echostructure"
                value={item.value}
                checked={echostructureMammaire === item.value}
                onChange={(e) => handleEchostructureChange(e.target.value)}
                required
              />
              {item.value}
            </label>
            {hoveredItem === item.value && (
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
                <img src={item.image} alt={item.value}
                  style={{ width: "220px", height: "180px", objectFit: "cover", borderRadius: "4px" }} />
                <p style={{ fontSize: "11px", color: "#1B2B6B", textAlign: "center", margin: "4px 0 0", fontWeight: "600" }}>
                  {item.value}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      {!echostructureMammaire && (
        <p className="text-red-600 text-sm mt-2">
          ⚠️ Veuillez sélectionner l'échostructure mammaire
        </p>
      )}
      {echostructureMammaire && (
        <p className="text-green-600 text-sm mt-2">
          ✅ Échostructure sélectionnée : {echostructureMammaire}
        </p>
      )}
    </div>
  );
};

export default EchostructureMammaireSection;