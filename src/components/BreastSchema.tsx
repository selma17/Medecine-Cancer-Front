import React from "react";
import "./BreastSchema.css";

interface BreastSchemaProps {
  localisation: string;
  distanceCentre: string;
  rayonHoraire: string;
  sein: "gauche" | "droite";
  onLocalisationChange: (value: string) => void;
  onDistanceCentreChange: (value: string) => void;
  onRayonHoraireChange: (value: string) => void;
  onSeinChange: (value: "gauche" | "droite") => void;
}

const BreastSchema: React.FC<BreastSchemaProps> = ({
  localisation,
  distanceCentre,
  rayonHoraire,
  sein,
  onLocalisationChange,
  onDistanceCentreChange,
  onRayonHoraireChange,
  onSeinChange,
}) => {
  // Fonction pour calculer la position de la masse selon l'horloge et la distance
  // rayonHoraireOverride : si fourni, utilisé en priorité pour l'angle
  const calculateMassPosition = (loc: string, distance: string, seinConcerne: "gauche" | "droite" = "gauche", rayonHoraireOverride?: string) => {
    const effectiveLoc = (rayonHoraireOverride || loc || "").trim();
    if (!effectiveLoc || !distance) return {};
    
    const distanceNum = parseFloat(distance);
    if (isNaN(distanceNum) || distanceNum <= 0) return {};

    const breastRadius = 80;
    const scale = breastRadius / 60;
    const adjustedDistance = Math.min(Math.max(distanceNum * scale, 8), breastRadius - 6);

    // 1) Essayer le format horaire (ex: "2H", "10H", "2")
    let angleDeg: number | null = null;
    const hourMatch = effectiveLoc.match(/^(\d{1,2})\s*[hH]?$/);
    if (hourMatch) {
      const hour = parseInt(hourMatch[1]);
      if (hour >= 1 && hour <= 12) angleDeg = hour * 30;
    }

    // 2) Essayer le format quadrant (QSE, QSEG, UQE, RA, etc.)
    if (angleDeg === null) {
      const u = effectiveLoc.toUpperCase().replace(/\s+/g, "");
      const qMap: { [k: string]: number } = {
        QSE:45, QSEG:45, QSED:45, QSI:315, QSIG:315, QSID:315,
        QIE:135, QIEG:135, QIED:135, QII:225, QIIG:225, QIID:225,
        UQE:90, UQEG:90, UQED:90, UQI:270, UQIG:270, UQID:270,
        UQS:0, UQSG:0, UQSD:0, UQINF:180, RA:-1, RAG:-1, RAD:-1,
      };
      if (u in qMap) angleDeg = qMap[u];
    }

    if (angleDeg === null) return {};

    let x: number, y: number;
    if (angleDeg === -1) { x = 0; y = 0; }
    else {
      const rad = (angleDeg * Math.PI) / 180;
      x = Math.sin(rad) * adjustedDistance;
      y = -Math.cos(rad) * adjustedDistance;
    }
    
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
            {(localisation || rayonHoraire) && sein === "gauche" && distanceCentre && (
               <div 
                 className="mass-indicator" 
                 title={`${rayonHoraire || localisation} - ${distanceCentre}mm`}
                 style={calculateMassPosition(localisation, distanceCentre, "gauche", rayonHoraire)}
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
            {(localisation || rayonHoraire) && sein === "droite" && distanceCentre && (
               <div 
                 className="mass-indicator" 
                 title={`${rayonHoraire || localisation} - ${distanceCentre}mm`}
                 style={calculateMassPosition(localisation, distanceCentre, "droite", rayonHoraire)}
               ></div>
             )}
          </div>
        </div>
      </div>
      
      <div className="localisation-inputs">
        <div className="input-group">
          <label className="form-label">
            Localisation
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={localisation}
            onChange={handleLocalisationChange}
            className="form-input"
            placeholder="Ex: 2H, 10H, QSE, QSEG"
            required
          />
        </div>
        
        <div className="input-group">
          <label className="form-label">
            Rayon horaire
          </label>
          <input
            type="text"
            value={rayonHoraire}
            onChange={(e) => onRayonHoraireChange(e.target.value)}
            className="form-input"
            placeholder="Ex: 2H, 10H"
          />
        </div>

        <div className="input-group">
          <label className="form-label">
            Distance par rapport au mamelon (mm)
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
        </div>
      </div>
      

    </div>
  );
};

export default BreastSchema;