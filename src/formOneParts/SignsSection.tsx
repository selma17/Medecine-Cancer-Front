import React from "react";

interface Props {
  signsAssociated: string[];
  handleSignsAssociatedChange: (value: string) => void;
}

const SignsSection: React.FC<Props> = ({
  signsAssociated,
  handleSignsAssociatedChange,
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
      <div className="options">
        {options.map((option) => (
          <label key={option} className="checkbox-label">
            <input
              type="checkbox"
              value={option}
              checked={signsAssociated.includes(option)}
              onChange={() => handleSignsAssociatedChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SignsSection;