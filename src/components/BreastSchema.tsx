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
  const calculateMassPosition = (localisation: string, distance: string, seinConcerne: "gauche" | "droite" = "gauche") => {
    if (!localisation || !distance) return {};
    
    const distanceNum = parseFloat(distance);
    if (isNaN(distanceNum) || distanceNum <= 0) return {};

    // Rayon visuel du sein en pixels
    const breastRadius = 80;

    // Distance max représentable = 60mm (bord du sein)
    // Échelle proportionnelle : 1mm = breastRadius/60 pixels
    const scale = breastRadius / 60;
    // Min 8px pour rester visible, max breastRadius-6 pour rester dans le cercle
    const adjustedDistance = Math.min(Math.max(distanceNum * scale, 8), breastRadius - 6);

    // ── 1) Essayer le format horaire (ex: "2H", "10H", "2") ──
    const hourMatch = localisation.match(/(\d+)\s*H?/i);
    let angleDeg: number | null = null;

    if (hourMatch) {
      const hour = parseInt(hourMatch[1]);
      if (hour >= 1 && hour <= 12) {
        // Chaque heure = 30° dans le sens horaire depuis 12H
        angleDeg = hour * 30;
      }
    }

    // ── 2) Essayer le format quadrant (QSE, QSEG, QII, UQE, RA, etc.) ──
    if (angleDeg === null) {
      const loc = localisation.trim().toUpperCase().replace(/\s+/g, "");
      // Mapping des quadrants vers l'angle central (degrés depuis 12H, sens horaire)
      const quadrantMap: { [key: string]: number } = {
        // Quadrants principaux (centre du quadrant)
        QSE: 45,    // Supéro-Externe → entre 12H et 3H
        QSEG: 45,
        QSED: 45,
        QSI: 315,   // Supéro-Interne → entre 9H et 12H
        QSIG: 315,
        QSID: 315,
        QIE: 135,   // Inféro-Externe → entre 3H et 6H
        QIEG: 135,
        QIED: 135,
        QII: 225,   // Inféro-Interne → entre 6H et 9H
        QIIG: 225,
        QIID: 225,
        // Unions de quadrants (axe central)
        UQE: 90,    // Union Quadrants Externes → 3H
        UQEG: 90,
        UQED: 90,
        UQI: 270,   // Union Quadrants Internes → 9H
        UQIG: 270,
        UQID: 270,
        UQS: 0,     // Union Quadrants Supérieurs → 12H
        UQSG: 0,
        UQSD: 0,
        UQINF: 180, // Union Quadrants Inférieurs → 6H
        // Rétro-aréolaire → centre
        RA: -1,
        RAG: -1,
        RAD: -1,
      };

      if (loc in quadrantMap) {
        angleDeg = quadrantMap[loc];
      }
    }

    // Aucun format reconnu
    if (angleDeg === null) return {};

    // Cas spécial rétro-aréolaire : point très proche du centre
    let x: number;
    let y: number;

    if (angleDeg === -1) {
      x = 0;
      y = 0;
    } else {
      // Conversion degrés → radians (0° = 12H, sens horaire)
      const rad = (angleDeg * Math.PI) / 180;
      x = Math.sin(rad) * adjustedDistance;
      y = -Math.cos(rad) * adjustedDistance;
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