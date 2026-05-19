import React from "react";

interface Props {
  signesAssocies: string[];
  handleSignesAssociesChange: (selected: string[]) => void;
  signesLocalisations: { [key: string]: string };
  handleSigneLocalisationChange: (sign: string, value: string) => void;
}

const SignesAssociesSection: React.FC<Props> = ({
  signesAssocies,
  handleSignesAssociesChange,
  signesLocalisations,
  handleSigneLocalisationChange,
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

  const handleCheckboxChange = (sign: string) => {
    if (signesAssocies.includes(sign)) {
      handleSignesAssociesChange(signesAssocies.filter((s) => s !== sign));
    } else {
      handleSignesAssociesChange([...signesAssocies, sign]);
    }
  };

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
          {signesAssocies.includes(sign) && (
            <input
              type="text"
              className="input-field mt-2 ml-4 block"
              placeholder={`Localisation — ${sign}`}
              value={signesLocalisations[sign] || ""}
              onChange={(e) => handleSigneLocalisationChange(sign, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SignesAssociesSection;