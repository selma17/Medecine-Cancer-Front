import React from "react";

interface Props {
  signesAssocies: string[];
  handleSignesAssociesChange: (selected: string[]) => void;
  signesLocalisations: { [key: string]: string };
  handleSigneLocalisationChange: (sign: string, value: string) => void;
  // Adénopathie axillaire — champs détaillés
  adenopathieLocalisation: string;
  adenopathieChaineBerg: string[];
  adenopathieNombre: string;
  adenopathieMesure: string;
  onAdenopathieLocalisationChange: (value: string) => void;
  onAdenopathieChaineBergChange: (value: string[]) => void;
  onAdenopathieNombreChange: (value: string) => void;
  onAdenopathieMesureChange: (value: string) => void;
}

const SignesAssociesSection: React.FC<Props> = ({
  signesAssocies,
  handleSignesAssociesChange,
  signesLocalisations,
  handleSigneLocalisationChange,
  adenopathieLocalisation,
  adenopathieChaineBerg,
  adenopathieNombre,
  adenopathieMesure,
  onAdenopathieLocalisationChange,
  onAdenopathieChaineBergChange,
  onAdenopathieNombreChange,
  onAdenopathieMesureChange,
}) => {
  const options = [
    "distorsion architecturale",
    "dilatation canalaire",
    "épaississement du revêtement cutané",
    "rétraction cutanée",
    "Adénopathies axillaires",
    "vascularisation en Doppler couleur",
    "Elastographie",
  ];

  const chaineBergOptions = ["I", "II", "III"];

  const handleCheckboxChange = (sign: string) => {
    if (signesAssocies.includes(sign)) {
      handleSignesAssociesChange(signesAssocies.filter((s) => s !== sign));
    } else {
      handleSignesAssociesChange([...signesAssocies, sign]);
    }
  };

  const handleBergToggle = (niveau: string) => {
    if (adenopathieChaineBerg.includes(niveau)) {
      onAdenopathieChaineBergChange(adenopathieChaineBerg.filter((n) => n !== niveau));
    } else {
      onAdenopathieChaineBergChange([...adenopathieChaineBerg, niveau]);
    }
  };

  const isAdenopathie = signesAssocies.includes("Adénopathies axillaires");

  return (
    <div className="additional-section border rounded-lg mt-6 p-4 bg-section">
      <p className="form-label mb-2">Signes associés</p>
      {options.map((sign) => (
        <div key={sign} className="mb-4">
          <label className="checkbox-label">
            <input
              type="checkbox"
              value={sign}
              checked={signesAssocies.includes(sign)}
              onChange={() => handleCheckboxChange(sign)}
            />
            {sign}
          </label>

          {/* Localisation générique pour tous les signes SAUF adénopathie */}
          {signesAssocies.includes(sign) && sign !== "Adénopathies axillaires" && (
            <input
              type="text"
              className="input-field mt-2 ml-4 block"
              placeholder={`Localisation — ${sign}`}
              value={signesLocalisations[sign] || ""}
              onChange={(e) => handleSigneLocalisationChange(sign, e.target.value)}
            />
          )}

          {/* Sous-formulaire détaillé pour Adénopathies axillaires */}
          {sign === "Adénopathies axillaires" && isAdenopathie && (
            <div
              style={{
                marginTop: "8px",
                marginLeft: "16px",
                padding: "14px",
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
              }}
            >
              {/* Localisation (droite / gauche / bilatérale) */}
              <div style={{ marginBottom: "12px" }}>
                <label className="form-label" style={{ fontSize: "13px" }}>
                  Localisation
                </label>
                <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                  {["droite", "gauche", "bilatérale"].map((loc) => (
                    <label
                      key={loc}
                      className="radio-label"
                      style={{
                        width: "auto",
                        flex: "1",
                        justifyContent: "center",
                        background: adenopathieLocalisation === loc ? "#EEF2F7" : "white",
                        borderColor: adenopathieLocalisation === loc ? "#1B2B6B" : "#e2e8f0",
                        fontWeight: adenopathieLocalisation === loc ? 600 : 400,
                      }}
                    >
                      <input
                        type="radio"
                        name="adenopathie-loc"
                        value={loc}
                        checked={adenopathieLocalisation === loc}
                        onChange={() => onAdenopathieLocalisationChange(loc)}
                        style={{ display: "none" }}
                      />
                      {loc.charAt(0).toUpperCase() + loc.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Chaîne de Berg (choix multiple : I, II, III) */}
              <div style={{ marginBottom: "12px" }}>
                <label className="form-label" style={{ fontSize: "13px" }}>
                  Chaîne de Berg
                </label>
                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                  {chaineBergOptions.map((niveau) => (
                    <label
                      key={niveau}
                      className="checkbox-label"
                      style={{
                        width: "auto",
                        flex: "1",
                        justifyContent: "center",
                        background: adenopathieChaineBerg.includes(niveau) ? "#EEF2F7" : "white",
                        borderColor: adenopathieChaineBerg.includes(niveau) ? "#1B2B6B" : "#e2e8f0",
                        fontWeight: adenopathieChaineBerg.includes(niveau) ? 600 : 400,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={adenopathieChaineBerg.includes(niveau)}
                        onChange={() => handleBergToggle(niveau)}
                        style={{ display: "none" }}
                      />
                      {niveau}
                    </label>
                  ))}
                </div>
              </div>

              {/* Nombre et mesure sur la même ligne */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="form-label" style={{ fontSize: "13px" }}>
                    Nombre
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Ex : 3"
                    min="0"
                    value={adenopathieNombre}
                    onChange={(e) => onAdenopathieNombreChange(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: "13px" }}>
                    Mesure (mm)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ex : 15x10"
                    value={adenopathieMesure}
                    onChange={(e) => onAdenopathieMesureChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SignesAssociesSection;