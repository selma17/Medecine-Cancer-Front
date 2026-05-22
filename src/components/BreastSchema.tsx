import React from "react";
import "./BreastSchema.css";

interface BreastSchemaProps {
  localisation: string;
  distanceCentre: string;
  sein: "gauche" | "droite";
  onLocalisationChange: (value: string) => void;
  onDistanceCentreChange: (value: string) => void;
  onSeinChange: (value: "gauche" | "droite") => void;
}

const BreastSchema: React.FC<BreastSchemaProps> = ({
  localisation,
  distanceCentre,
  sein,
  onLocalisationChange,
  onDistanceCentreChange,
  onSeinChange,
}) => {
  // Fonction pour calculer la position de la masse selon l'horloge et la distance
  const calculateMassPosition = (localisation: string, distance: string, seinConcerne: "gauche" | "droite" = "gauche") => {
    if (!localisation || !distance) return {};
    
    const distanceNum = parseFloat(distance);
    if (isNaN(distanceNum) || distanceNum <= 0) return {};
    
         // Rayon du sein (en pixels) - ajusté pour correspondre exactement aux labels
     const breastRadius = 80;
     
     // Extraire l'heure de la localisation (ex: "2H" ou "2" -> 2)
     const hourMatch = localisation.match(/(\d+)H?/);
     if (!hourMatch) return {};
     
     const hour = parseInt(hourMatch[1]);
     
     // Valider que l'heure est entre 1 et 12
     if (hour < 1 || hour > 12) return {};
     
     // Ajustement de précision : utiliser des positions exactes pour toutes les heures
     const adjustedDistance = breastRadius * 0.8; // Position fixe à 80% du rayon pour tous
     
     // MAPPING DIRECT ET SIMPLE : chaque heure = position fixe avec ajustement de précision
     let x = 0;
     let y = 0;
     
           switch (hour) {
        case 12: // 12H = haut
          x = 0;
          y = -adjustedDistance;
          break;
        case 1: // 1H = haut-droite
          x = adjustedDistance * 0.5;
          y = -adjustedDistance * 0.87;
          break;
        case 2: // 2H = haut-droite
          x = adjustedDistance * 0.87;
          y = -adjustedDistance * 0.5;
          break;
        case 3: // 3H = droite
          x = adjustedDistance;
          y = 0;
          break;
        case 4: // 4H = bas-droite
          x = adjustedDistance * 0.87;
          y = adjustedDistance * 0.5;
          break;
        case 5: // 5H = bas-droite
          x = adjustedDistance * 0.5;
          y = adjustedDistance * 0.87;
          break;
        case 6: // 6H = bas
          x = 0;
          y = adjustedDistance;
          break;
        case 7: // 7H = bas-gauche
          x = -adjustedDistance * 0.5;
          y = adjustedDistance * 0.87;
          break;
        case 8: // 8H = bas-gauche
          x = -adjustedDistance * 0.87;
          y = adjustedDistance * 0.5;
          break;
        case 9: // 9H = gauche
          x = -adjustedDistance;
          y = 0;
          break;
        case 10: // 10H = haut-gauche
          x = -adjustedDistance * 0.87;
          y = -adjustedDistance * 0.5;
          break;
        case 11: // 11H = haut-gauche
          x = -adjustedDistance * 0.5;
          y = -adjustedDistance * 0.87;
          break;
        default:
          x = 0;
          y = 0;
      }
    
    // Pour le sein droit, le système d'horloge est en miroir (x inversé)
    const finalX = seinConcerne === "droite" ? -x : x;

    return {
      position: 'absolute' as const,
      left: `calc(50% + ${finalX}px)`,
      top: `calc(50% + ${y}px)`,
      transform: 'translate(-50%, -50%)',
    };
  };

  const handleLocalisationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLocalisationChange(e.target.value);
  };

  const handleDistanceCentreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDistanceCentreChange(e.target.value);
  };

  const handleSeinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSeinChange(e.target.value as "gauche" | "droite");
  };

  return (
    <div className="breast-schema-container">
      {/* Sélecteur de sein */}
      <div className="sein-selector">
        <label className="form-label">
          Sein concerné
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          value={sein}
          onChange={handleSeinChange}
          className="form-select"
          required
        >
          <option value="gauche">Sein gauche</option>
          <option value="droite">Sein droit</option>
        </select>
      </div>

      <div className="breasts-container">
        {/* Sein gauche */}
        <div className={`breast-schema-wrapper ${sein === "gauche" ? "active" : ""}`}>
          <div className="breast-outline breast-left">
            <div className="breast-label">Gauche</div>
            {/* Ligne 12H */}
            <div className="clock-line vertical-line-12"></div>
            <span className="clock-label clock-12">12H</span>
            
            {/* Ligne 6H */}
            <div className="clock-line vertical-line-6"></div>
            <span className="clock-label clock-6">6H</span>
            
            {/* Ligne 3H */}
            <div className="clock-line horizontal-line-3"></div>
            <span className="clock-label clock-3">3H</span>
            
            {/* Ligne 9H */}
            <div className="clock-line horizontal-line-9"></div>
            <span className="clock-label clock-9">9H</span>
            
            {/* Centre (mamelon) */}
            <div className="nipple-center"></div>
            
                         {/* Indicateur de masse si localisation est définie et sein gauche sélectionné */}
             {localisation && sein === "gauche" && distanceCentre && (
               <div 
                 className="mass-indicator" 
                 title={`${localisation} - ${distanceCentre}mm`}
                 style={calculateMassPosition(localisation, distanceCentre, "gauche")}
               ></div>
             )}
          </div>
        </div>

        {/* Sein droit */}
        <div className={`breast-schema-wrapper ${sein === "droite" ? "active" : ""}`}>
          <div className="breast-outline breast-right">
            <div className="breast-label">Droite</div>
            {/* Ligne 12H */}
            <div className="clock-line vertical-line-12"></div>
            <span className="clock-label clock-12">12H</span>
            
            {/* Ligne 6H */}
            <div className="clock-line vertical-line-6"></div>
            <span className="clock-label clock-6">6H</span>
            
            {/* Ligne 3H */}
            <div className="clock-line horizontal-line-3"></div>
            <span className="clock-label clock-3">3H</span>
            
            {/* Ligne 9H */}
            <div className="clock-line horizontal-line-9"></div>
            <span className="clock-label clock-9">9H</span>
            
            {/* Centre (mamelon) */}
            <div className="nipple-center"></div>
            
                         {/* Indicateur de masse si localisation est définie et sein droit sélectionné */}
             {localisation && sein === "droite" && distanceCentre && (
               <div 
                 className="mass-indicator" 
                 title={`${localisation} - ${distanceCentre}mm`}
                 style={calculateMassPosition(localisation, distanceCentre, "droite")}
               ></div>
             )}
          </div>
        </div>
      </div>
      
      <div className="localisation-inputs">
        <div className="input-group">
          <label className="form-label">
            Localisation (ex: 2H, 10H, etc.)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={localisation}
            onChange={handleLocalisationChange}
            className="form-input"
            placeholder="Ex: 2H, 10H, 3H"
            required
          />
          <small className="text-muted">
            Utilisez le système d'horloge : 12H (haut), 3H (droite), 6H (bas), 9H (gauche)
          </small>
        </div>
        
        <div className="input-group">
          <label className="form-label">
            Distance du centre (mm)
          </label>
          <input
            type="number"
            value={distanceCentre}
            onChange={handleDistanceCentreChange}
            className="form-input"
            placeholder="Ex: 25"
            min="0"
            step="1"
          />
          <small className="text-muted">
            Distance mesurée depuis le centre du mamelon
          </small>
        </div>
      </div>
      

    </div>
  );
};

export default BreastSchema;