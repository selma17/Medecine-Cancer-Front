import React from "react";

interface Props {
  signsAssociated: string[];
  handleSignsAssociatedChange: (value: string) => void;
  signsLocalisations: { [key: string]: string };
  handleSignLocalisationChange: (sign: string, value: string) => void;
}

const SignsSection: React.FC<Props> = ({
  signsAssociated,
  handleSignsAssociatedChange,
  signsLocalisations,
  handleSignLocalisationChange,
}) => {
  const options = [
    "rétraction cutanée",
    "rétraction du mamelon",
    "Épaississement du revêtement cutané",
    "Adénopathie axillaire",
  ];

  return (
    <div className="content">
      <p className="title">Signes associés</p>
      <div className="options" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        {options.map((option) => (
          <div key={option} style={{ width: "100%", marginBottom: "8px" }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                value={option}
                checked={signsAssociated.includes(option)}
                onChange={() => handleSignsAssociatedChange(option)}
              />
              {option}
            </label>
            {signsAssociated.includes(option) && (
              <input
                type="text"
                placeholder={`Localisation — ${option}`}
                value={signsLocalisations[option] || ""}
                onChange={(e) => handleSignLocalisationChange(option, e.target.value)}
                className="text-input"
                style={{ marginTop: "6px", marginLeft: "28px", width: "calc(100% - 28px)" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignsSection;