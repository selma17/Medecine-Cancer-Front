// src/stepper/Stepper.tsx
import React from "react";
import "./Stepper.css";

interface Step {
  title: string;
  status: "terminé" | "en cours" | "en attente";
  subtitle?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="stepper-container">
      {steps.map((step, index) => (
        <div className="stepper-step" key={index}>
          <div className={`stepper-circle ${step.status} ${index === currentStep ? "current" : ""}`}>
            {step.status === "terminé" ? "✔" : index + 1}
          </div>

          {index !== steps.length - 1 && (
            <div
              className={`stepper-line ${
                steps[index + 1].status === "terminé" || steps[index + 1].status === "en cours"
                  ? "active"
                  : ""
              }`}
            />
          )}

          <div className="stepper-labels">
            <div className="step-title">Etape {index + 1}</div>
            <div className="step-heading">{step.title}</div>
            <div className={`step-subtitle ${step.status}`}>
              {step.status === "terminé"
                ? "Completed"
                : step.status === "en cours"
                ? "En cours"
                : "En attente"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
