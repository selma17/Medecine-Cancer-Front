import React from "react";

interface Props {
  nombreMasse: number | "";
  handleNombreMasseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NombreMasseSection: React.FC<Props> = ({ nombreMasse, handleNombreMasseChange }) => {
  return (
    <div className="additional-section border rounded-lg mt-4 p-4">
      <label className="form-label">
        Nombre de masse(s) échographique(s) 
      </label>
      <input
        type="number"
        min="0"
        max="10"
        value={nombreMasse}
        onChange={handleNombreMasseChange}
        className="form-input"
        placeholder="Ex: 1"
      />
      {nombreMasse === 0 && (
        <p className="text-orange-600 text-sm mt-2">
          ⚠️ Si vous sélectionnez 0, aucune masse échographique ne sera analysée pour le calcul ACR
        </p>
      )}
      {nombreMasse && nombreMasse > 0 && (
        <p className="text-green-600 text-sm mt-2">
          ✅ Veuillez remplir les détails pour {nombreMasse} masse(s) échographique(s)
        </p>
      )}
    </div>
  );
};

export default NombreMasseSection;
