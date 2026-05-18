import React from "react";

interface Props {
  signesAssocies: string[];
  handleSignesAssociesChange: (selected: string[]) => void;
}

const SignesAssociesSection: React.FC<Props> = ({ signesAssocies, handleSignesAssociesChange }) => {
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
        <label key={sign} className="checkbox-label">
          <input
            type="checkbox"
            value={sign}
            checked={signesAssocies.includes(sign)}
            onChange={() => handleCheckboxChange(sign)}
          />
          {sign}
        </label>
      ))}
    </div>
  );
};

export default SignesAssociesSection;