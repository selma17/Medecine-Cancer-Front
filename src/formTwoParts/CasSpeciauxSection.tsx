import React from "react";

interface Props {
  casSpeciaux: string[];
  handleCasSpeciauxChange: (selected: string[]) => void;
  localisations: { [key: string]: string };
  handleLocalisationChange: (key: string, value: string) => void;
}

const CasSpeciauxSection: React.FC<Props> = ({
  casSpeciaux,
  handleCasSpeciauxChange,
  localisations,
  handleLocalisationChange,
}) => {
  const specialCases = [
    "kyste simple",
    "amas de microkystes",
    "kyste compliqué",
    "masse cutanée",
    "corps étrangers mammaires",
    "ganglion intra mammaire",
    "collection post operatoire",
    "cytosteatonécrose",
  ];

  const handleCheckboxChange = (specialCase: string) => {
    if (casSpeciaux.includes(specialCase)) {
      handleCasSpeciauxChange(casSpeciaux.filter((c) => c !== specialCase));
    } else {
      handleCasSpeciauxChange([...casSpeciaux, specialCase]);
    }
  };

  return (
    <div className="additional-section border rounded-lg mt-6 p-4 bg-section">
      <p className="form-label mb-2">Cas spéciaux</p>
      {specialCases.map((specialCase) => (
        <div key={specialCase} className="mb-4">
          <label className="checkbox-label">
            <input
              type="checkbox"
              value={specialCase}
              checked={casSpeciaux.includes(specialCase)}
              onChange={() => handleCheckboxChange(specialCase)}
            />
            {specialCase}
          </label>

          {casSpeciaux.includes(specialCase) && (
            <input
              type="text"
              className="input-field mt-2 ml-4 block"
              placeholder={`Localisation pour "${specialCase}"`}
              value={localisations[specialCase] || ""}
              onChange={(e) => handleLocalisationChange(specialCase, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CasSpeciauxSection;