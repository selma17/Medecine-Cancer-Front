import React, { useState } from "react";
import jsPDF from "jspdf";

interface MedicalReportProps {
  isOpen: boolean;
  onClose: () => void;
  scanData: {
    scanId?: string;
    clientInfo?: {
      nom?: string;
      prenom?: string;
      renseignementsCliniques?: string;
      dateNaissance?: string;
      telephone?: string;
      emailPatient?: string;
      emailMedecin?: string;
    };
    mammographie?: {
      densiteMammaire?: string;
      masses?: Array<{
        localisation: string;
        forme: string;
        contours: string;
        densite: string;
        distanceCentre?: string;
        sein?: string;
        localisationDetail?: string;
      }>;
      asymetrie?: boolean;
      typeAsymetrie?: string;
      localisationAsymetrie?: string;
      distorsionArchitecturale?: boolean;
      localisationDistorsion?: string;
      calcifications?: boolean;
      typesCalcifications?: string;
      localisationCalcifications?: string;
      calcificationsBenignes?: string;
      calcificationsSuspectes?: string;
      distributionMicrocalcifications?: string;
      signesAssocies?: Array<{ nom: string; localisation?: string }> | string[];
    };
    echographie?: {
      echostructureMammaire?: string;
      masses?: Array<{
        localisation: string;
        mesure: string;
        forme: string;
        contours: string;
        densite: string;
        orientation: string;
        comportement: string;
        calcifications: string;
        distanceCentre?: string;
        rayonHoraire?: string;
        sein?: string;
      }>;
      signesAssocies?: Array<{ nom: string; localisation?: string }> | string[];
      casSpeciaux?: Array<{ nom: string; localisation?: string }>;
      // Adénopathie axillaire
      adenopathieLocalisation?: string;
      adenopathieChaineBerg?: string;
      adenopathieNombre?: string;
      adenopathieMesure?: string;
    };
    resultats?: {
      acrScore?: string;
      acrType?: string;
      conclusionIA?: string;
      conduiteATenir?: string;
      // Nouveaux champs par sein
      acrDroit?: string;
      acrGauche?: string;
      recommendationDroit?: string;
      recommendationGauche?: string;
      fullAiResponse?: string;
      seinsAvecMasses?: string[];
    };
  };
}

// ─── Helper : extraire ACR droit/gauche depuis la réponse IA ─────────────────
const parsePerBreastResults = (fullResponse?: string, conduiteATenir?: string) => {
  if (!fullResponse) {
    return {
      acrDroit: null,
      acrGauche: null,
      recoDroit: conduiteATenir || null,
      recoGauche: conduiteATenir || null,
    };
  }

  const droitMatch = fullResponse.match(/ACR\s+sein\s+droit\s*[:-]?\s*([0-9][ABC]?)/i);
  const gaucheMatch = fullResponse.match(/ACR\s+sein\s+gauche\s*[:-]?\s*([0-9][ABC]?)/i);

  // Recommandations : on cherche après chaque ACR
  const droitRecoMatch = fullResponse.match(
    /ACR\s+sein\s+droit[^.]*\.\s*(.+?)(?=ACR\s+sein\s+gauche|$)/is
  );
  const gaucheRecoMatch = fullResponse.match(/ACR\s+sein\s+gauche[^.]*\.\s*(.+?)(?=\n\n|$)/is);

  return {
    acrDroit: droitMatch ? droitMatch[1].trim() : null,
    acrGauche: gaucheMatch ? gaucheMatch[1].trim() : null,
    recoDroit: droitRecoMatch ? droitRecoMatch[1].trim().substring(0, 150) : conduiteATenir || null,
    recoGauche: gaucheRecoMatch ? gaucheRecoMatch[1].trim().substring(0, 150) : conduiteATenir || null,
  };
};

// ─── Mapping ACR → couleur ───────────────────────────────────────────────────
const acrColor = (score: string | null) => {
  if (!score) return "#64748b";
  const n = parseInt(score[0]);
  if (n <= 2) return "#16a34a";
  if (n === 3) return "#ca8a04";
  if (n === 4) return "#ea580c";
  return "#dc2626";
};

// ─── Composant montre mammaire (clock diagram) ───────────────────────────────
const BreastClockDiagram: React.FC<{
  masses: Array<{ localisation?: string; sein?: string; mesure?: string }>;
  sein: "droit" | "gauche";
  label: string;
}> = ({ masses, sein, label }) => {
  const SIZE = 110;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 44;

  // Filtrer les masses de ce sein
  const sesMasses = masses.filter((m) => {
    if (!m.sein) return false; // pas de sein → ne pas afficher
    const s = m.sein.toLowerCase();
    if (sein === "droit") return s.startsWith("droit");
    return s.startsWith("gauche");
  });

  // Convertir une localisation horaire en angle (12h = haut, sens horaire)
  const heureToAngle = (loc: string): number | null => {
    const match = loc.match(/^(\d{1,2})\s*[hH]?$/);
    if (!match) return null;
    const h = parseInt(match[1]);
    if (h < 1 || h > 12) return null;
    return ((h % 12) / 12) * 360 - 90; // -90 pour partir du haut
  };

  // Quadrants textuels (formats : QSE, QSEG, QSED, UQE, RA, ou texte long)
  const quadrantAngle = (loc: string): number | null => {
    const l = loc.trim().toUpperCase().replace(/\s+/g, "");
    // Abréviations standard
    if (/^QSE[GD]?$/.test(l))    return -45;   // Supéro-Externe
    if (/^QSI[GD]?$/.test(l))    return -135;  // Supéro-Interne
    if (/^QIE[GD]?$/.test(l))    return 45;    // Inféro-Externe
    if (/^QII[GD]?$/.test(l))    return 135;   // Inféro-Interne
    if (/^UQE[GD]?$/.test(l))    return 0;     // Union Quadrants Externes → 3H
    if (/^UQI[GD]?$/.test(l))    return 180;   // Union Quadrants Internes → 9H
    if (/^UQS[GD]?$/.test(l))    return -90;   // Union Quadrants Supérieurs → 12H
    if (/^UQINF[GD]?$/.test(l))  return 90;    // Union Quadrants Inférieurs → 6H
    if (/^RA[GD]?$/.test(l))     return 0;     // Rétro-aréolaire → centre (angle 0, distance réduite)
    // Texte long (fallback)
    const ll = loc.toLowerCase();
    if (ll.includes("sup") && ll.includes("ext")) return -45;
    if (ll.includes("sup") && ll.includes("int")) return -135;
    if (ll.includes("inf") && ll.includes("ext")) return 45;
    if (ll.includes("inf") && ll.includes("int")) return 135;
    if (ll.includes("central") || ll.includes("mamelonnaire")) return 0;
    return null;
  };

  const getAngle = (loc: string): number | null => {
    const h = heureToAngle(loc);
    if (h !== null) return h;
    return quadrantAngle(loc);
  };

  // Ticks des heures
  const ticks = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div style={{ textAlign: "center", display: "inline-block" }}>
      <div style={{ fontSize: "9px", fontWeight: "bold", color: "#1B2B6B", marginBottom: "2px" }}>
        {label}
      </div>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cercle extérieur */}
        <circle cx={CX} cy={CY} r={R + 8} fill="white" stroke="#1B2B6B" strokeWidth="1.5" />
        {/* Cercle mammaire */}
        <circle cx={CX} cy={CY} r={R} fill="#EEF2F7" stroke="#1B2B6B" strokeWidth="1" />
        {/* Mameleon */}
        <circle cx={CX} cy={CY} r={5} fill="#1B2B6B" opacity="0.4" />

        {/* Lignes quadrants */}
        <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} stroke="#ccc" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} stroke="#ccc" strokeWidth="0.5" strokeDasharray="2,2" />

        {/* Ticks horaires */}
        {ticks.map((h) => {
          const angleDeg = ((h % 12) / 12) * 360 - 90;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x1 = CX + (R - 3) * Math.cos(angleRad);
          const y1 = CY + (R - 3) * Math.sin(angleRad);
          const x2 = CX + R * Math.cos(angleRad);
          const y2 = CY + R * Math.sin(angleRad);
          const xt = CX + (R + 5) * Math.cos(angleRad);
          const yt = CY + (R + 5) * Math.sin(angleRad);
          return (
            <g key={h}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1B2B6B" strokeWidth="1" />
              <text
                x={xt}
                y={yt}
                fontSize="5"
                fill="#1B2B6B"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {h}
              </text>
            </g>
          );
        })}

        {/* Points des masses */}
        {sesMasses.map((m, idx) => {
          const loc = m.localisation || "";
          const angle = getAngle(loc);
          if (angle === null) {
            // Masse au centre si localisation inconnue
            return (
              <circle
                key={idx}
                cx={CX + (idx * 6 - 3)}
                cy={CY}
                r={5}
                fill="#dc2626"
                stroke="white"
                strokeWidth="1"
                opacity="0.85"
              />
            );
          }
          const rad = (angle * Math.PI) / 180;
          const dist = R * 0.6;
          const px = CX + dist * Math.cos(rad);
          const py = CY + dist * Math.sin(rad);
          return (
            <g key={idx}>
              <circle cx={px} cy={py} r={5} fill="#dc2626" stroke="white" strokeWidth="1" opacity="0.9" />
              <text x={px} y={py + 0.5} fontSize="5" fill="white" textAnchor="middle" dominantBaseline="middle">
                {idx + 1}
              </text>
            </g>
          );
        })}

        {sesMasses.length === 0 && (
          <text x={CX} y={CY + 16} fontSize="5" fill="#64748b" textAnchor="middle">
            Aucune masse
          </text>
        )}
      </svg>
      {sesMasses.length > 0 && (
        <div style={{ fontSize: "7px", color: "#555", marginTop: "2px" }}>
          {sesMasses.map((m, i) => (
            <div key={i}>
              <span style={{ color: "#dc2626", fontWeight: "bold" }}>●{i + 1}</span>{" "}
              {m.localisation || "—"}
              {m.mesure ? ` (${m.mesure} mm)` : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Composant principal ─────────────────────────────────────────────────────
const MedicalReport: React.FC<MedicalReportProps> = ({ isOpen, onClose, scanData }) => {
  const [sending, setSending] = useState(false);

  const handleSendEmail = async () => {
    const emailPatient = scanData.clientInfo?.emailPatient;
    const emailMedecin = scanData.clientInfo?.emailMedecin;

    const recipients = [emailPatient, emailMedecin].filter(Boolean) as string[];
    if (recipients.length === 0) {
      alert("Aucun email renseigné pour ce patient ou le médecin traitant.");
      return;
    }

    setSending(true);
    try {
      const patientName = `${scanData.clientInfo?.nom || ""} ${scanData.clientInfo?.prenom || ""}`.trim();
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const drName = user?.nom && user?.prenom
        ? `Dr. ${user.prenom} ${user.nom}`
        : `Dr. ${user?.nom || "Médecin Radiologue"}`;
      const acrD  = scanData.resultats?.acrDroit  || "";
      const acrG  = scanData.resultats?.acrGauche || "";
      const recoD = scanData.resultats?.recommendationDroit  || "";
      const recoG = scanData.resultats?.recommendationGauche || "";
      const acrGlobal       = scanData.resultats?.acrScore       || "";
      const conduiteGlobale = scanData.resultats?.conduiteATenir  || "";
      const today = new Date().toLocaleDateString("fr-FR");

      // ── Helpers signes associés / cas spéciaux pour le PDF ───────────
      const signesToLines = (
        signes?: Array<{ nom: string; localisation?: string }> | string[]
      ): string[] => {
        if (!signes || signes.length === 0) return [];
        if (typeof signes[0] === "string") {
          return (signes as string[]).map((s) => `• ${s}`);
        }
        return (signes as Array<{ nom: string; localisation?: string }>).map(
          (s) => `• ${s.nom}${s.localisation ? ` — ${s.localisation}` : ""}`
        );
      };

      // ── Génération PDF structuré avec jsPDF ──────────────────────────
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = 210;
      const margin = 18;
      const contentW = pageW - margin * 2;
      let y = 0;

      const checkNewPage = (needed = 10) => {
        if (y + needed > 272) { doc.addPage(); y = 15; }
      };

      // Dessine un sous-bloc « Signes associés » / « Cas spéciaux » dans le PDF
      const drawSignesBlock = (title: string, lines: string[]) => {
        if (lines.length === 0) return;
        checkNewPage(12);
        doc.setFillColor(238, 242, 247);
        doc.rect(margin, y, contentW, 5, "FD");
        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(27, 43, 107);
        doc.text(title, margin + 3, y + 3.5);
        y += 5;
        doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
        lines.forEach((line) => {
          const wrapped = doc.splitTextToSize(line, contentW - 6);
          const lh = wrapped.length * 4 + 2;
          checkNewPage(lh);
          doc.setDrawColor(220, 220, 220);
          doc.rect(margin, y, contentW, lh, "S");
          doc.text(wrapped, margin + 3, y + 4);
          y += lh;
        });
        y += 2;
      };

      // ── EN-TÊTE ──────────────────────────────────────────────────────
      doc.setFillColor(27, 43, 107);
      doc.rect(0, 0, pageW, 36, "F");
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("COMPTE RENDU D'EXAMEN RADIOLOGIQUE", pageW / 2, 13, { align: "center" });
      doc.setFontSize(11);
      doc.text("ECHO-MAMMOGRAPHIE", pageW / 2, 22, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Hôpital Régional Ksar Hellal — Service d'Imagerie Médicale", pageW / 2, 30, { align: "center" });
      y = 44;

      // ── INFOS PATIENT ────────────────────────────────────────────────
      doc.setFillColor(238, 242, 247);
      doc.rect(margin, y, contentW, 26, "F");
      doc.setDrawColor(27, 43, 107);
      doc.rect(margin, y, contentW, 26, "S");
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(27, 43, 107);
      doc.text("INFORMATIONS PATIENT", margin + 3, y + 5);
      doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
      const half = contentW / 2 - 2;
      doc.text(`Bénéficiaire : ${patientName.toUpperCase()}`, margin + 3, y + 12);
      doc.text(`Date de naissance : ${scanData.clientInfo?.dateNaissance || "—"}`, margin + 3 + half, y + 12);
      doc.text(`Téléphone : ${scanData.clientInfo?.telephone || "—"}`, margin + 3, y + 19);
      doc.text(`Date de l'examen : ${today}`, margin + 3 + half, y + 19);
      y += 30;

      // ── RENSEIGNEMENTS CLINIQUES ─────────────────────────────────────
      doc.setFillColor(27, 43, 107);
      doc.rect(margin, y, contentW, 6, "F");
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
      doc.text("RENSEIGNEMENTS CLINIQUES", margin + 3, y + 4);
      y += 6;
      const rc = scanData.clientInfo?.renseignementsCliniques || "—";
      const rcLines = doc.splitTextToSize(rc, contentW - 6);
      const rcH = Math.max(8, rcLines.length * 4 + 4);
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, y, contentW, rcH, "S");
      doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
      doc.text(rcLines, margin + 3, y + 4);
      y += rcH + 5;

      // ── MAMMOGRAPHIE ─────────────────────────────────────────────────
      checkNewPage(40);
      doc.setFillColor(27, 43, 107);
      doc.rect(margin, y, contentW, 6, "F");
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
      doc.text("RÉSULTAT — MAMMOGRAPHIE", margin + 3, y + 4);
      y += 6;

      // Grille données générales
      const mammoLines: string[] = [];
      if (scanData.mammographie?.densiteMammaire)
        mammoLines.push(`Densité mammaire : ${scanData.mammographie.densiteMammaire}`);
      if (!mammoLines.length) mammoLines.push("Aucune anomalie générale renseignée.");

      const mammoH = mammoLines.length * 5 + 4;
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(252, 253, 255);
      doc.rect(margin, y, contentW, mammoH, "FD");
      doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
      mammoLines.forEach((line, i) => {
        doc.text(`• ${line}`, margin + 3, y + 4 + i * 5);
      });
      y += mammoH + 2;

      // Masses mammographie
      const mammoMasses = scanData.mammographie?.masses || [];
      if (mammoMasses.length > 0) {
        checkNewPage(8 + mammoMasses.length * 6);
        doc.setFillColor(238, 242, 247);
        doc.rect(margin, y, contentW, 6, "FD");
        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(27, 43, 107);
        doc.text(`Masses détectées (${mammoMasses.length})`, margin + 3, y + 4);
        y += 6;
        // En-têtes tableau
        const cols = [10, 22, 22, 28, 28, 28, 36];
        const headers = ["N°", "Sein", "Loc.", "Forme", "Contours", "Densité", ""];
        let xc = margin;
        doc.setFillColor(27, 43, 107);
        doc.rect(margin, y, contentW, 5, "F");
        doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
        headers.forEach((h, i) => { doc.text(h, xc + 1, y + 3.5); xc += cols[i]; });
        y += 5;
        mammoMasses.forEach((m, i) => {
          checkNewPage(6);
          xc = margin;
          doc.setFillColor(i % 2 === 0 ? 250 : 245, i % 2 === 0 ? 251 : 247, 255);
          doc.rect(margin, y, contentW, 5, "F");
          doc.setDrawColor(220, 220, 220);
          doc.rect(margin, y, contentW, 5, "S");
          doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
          const cells = [`${i+1}`, m.sein||"—", m.localisation||"—", m.forme||"—", m.contours||"—", m.densite||"—", ""];
          cells.forEach((c, ci) => { doc.text(c, xc + 1, y + 3.5); xc += cols[ci]; });
          y += 5;
        });
        y += 3;
      }
      y += 3;

      // Résultats complémentaires — mammographie (après le tableau des masses)
      const compLines: string[] = [];
      compLines.push(`Asymétrie : ${scanData.mammographie?.asymetrie
        ? `${scanData.mammographie.typeAsymetrie || "Oui"}${scanData.mammographie.localisationAsymetrie ? " — " + scanData.mammographie.localisationAsymetrie : ""}`
        : "Non"}`);
      compLines.push(`Distorsion architecturale : ${scanData.mammographie?.distorsionArchitecturale
        ? `Oui${scanData.mammographie.localisationDistorsion ? " — " + scanData.mammographie.localisationDistorsion : ""}`
        : "Non"}`);
      compLines.push(`Calcifications : ${scanData.mammographie?.calcifications ? "Oui" : "Non"}`);
      if (scanData.mammographie?.calcifications) {
        if (scanData.mammographie.typesCalcifications)
          compLines.push(`  Type : ${scanData.mammographie.typesCalcifications}`);
        if (scanData.mammographie.localisationCalcifications)
          compLines.push(`  Localisation : ${scanData.mammographie.localisationCalcifications}`);
        if (scanData.mammographie.calcificationsBenignes)
          compLines.push(`  Bénignes : ${scanData.mammographie.calcificationsBenignes}`);
        if (scanData.mammographie.calcificationsSuspectes)
          compLines.push(`  Suspectes : ${scanData.mammographie.calcificationsSuspectes}`);
        if (scanData.mammographie.distributionMicrocalcifications)
          compLines.push(`  Distribution : ${scanData.mammographie.distributionMicrocalcifications}`);
      }
      drawSignesBlock("Résultats complémentaires", compLines);

      // Signes associés — mammographie (après le tableau des masses)
      drawSignesBlock("Signes associés", signesToLines(scanData.mammographie?.signesAssocies));

      // ── ÉCHOGRAPHIE ──────────────────────────────────────────────────
      checkNewPage(40);
      doc.setFillColor(27, 43, 107);
      doc.rect(margin, y, contentW, 6, "F");
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
      doc.text("RÉSULTAT — ÉCHOGRAPHIE", margin + 3, y + 4);
      y += 6;

      const echoLines: string[] = [];
      if (scanData.echographie?.echostructureMammaire)
        echoLines.push(`Échostructure : ${scanData.echographie.echostructureMammaire}`);
      if (!echoLines.length) echoLines.push("Aucune donnée générale renseignée.");

      const echoH = echoLines.length * 5 + 4;
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(252, 253, 255);
      doc.rect(margin, y, contentW, echoH, "FD");
      doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
      echoLines.forEach((line, i) => {
        doc.text(`• ${line}`, margin + 3, y + 4 + i * 5);
      });
      y += echoH + 2;

      // Masses échographie
      const echoMasses = scanData.echographie?.masses || [];
      if (echoMasses.length > 0) {
        checkNewPage(8 + echoMasses.length * 6);
        doc.setFillColor(238, 242, 247);
        doc.rect(margin, y, contentW, 6, "FD");
        doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(27, 43, 107);
        doc.text(`Masses détectées (${echoMasses.length})`, margin + 3, y + 4);
        y += 6;
        const cols2 = [10, 14, 14, 14, 14, 16, 16, 16, 18, 18, 0];
        const heads2 = ["N°", "Loc.", "Rayon H.", "Sein", "Mesure", "Dist.mam.", "Forme", "Contours", "Écho.", "Orient.", ""];
        let xc2 = margin;
        doc.setFillColor(27, 43, 107);
        doc.rect(margin, y, contentW, 5, "F");
        doc.setFontSize(6); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
        heads2.forEach((h, i) => { doc.text(h, xc2 + 1, y + 3.5); xc2 += cols2[i]; });
        y += 5;
        echoMasses.forEach((m, i) => {
          checkNewPage(6);
          xc2 = margin;
          doc.setFillColor(i % 2 === 0 ? 250 : 245, i % 2 === 0 ? 251 : 247, 255);
          doc.rect(margin, y, contentW, 5, "F");
          doc.setDrawColor(220, 220, 220);
          doc.rect(margin, y, contentW, 5, "S");
          doc.setFontSize(6); doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
          const cells2 = [`${i+1}`, m.localisation||"—", m.rayonHoraire||"—", m.sein||"—", m.mesure ? `${m.mesure}mm` : "—", m.distanceCentre ? `${m.distanceCentre}mm` : "—", m.forme||"—", m.contours||"—", m.densite||"—", m.orientation||"—", ""];
          cells2.forEach((c, ci) => { doc.text(c, xc2 + 1, y + 3.5); xc2 += cols2[ci]; });
          y += 5;
        });
        y += 3;
      }
      y += 3;

      // Signes associés / cas spéciaux — échographie (après le tableau des masses)
      drawSignesBlock("Signes associés", signesToLines(scanData.echographie?.signesAssocies));
      drawSignesBlock(
        "Cas spéciaux",
        (scanData.echographie?.casSpeciaux || []).map(
          (c) => `• ${c.nom}${c.localisation ? ` — ${c.localisation}` : ""}`
        )
      );

      // Adénopathie axillaire — détails dans le PDF
      if (scanData.echographie?.adenopathieLocalisation) {
        const adenLines: string[] = [];
        adenLines.push(`Localisation : ${scanData.echographie.adenopathieLocalisation}`);
        if (scanData.echographie.adenopathieChaineBerg)
          adenLines.push(`Chaîne de Berg : ${scanData.echographie.adenopathieChaineBerg}`);
        if (scanData.echographie.adenopathieNombre)
          adenLines.push(`Nombre : ${scanData.echographie.adenopathieNombre}`);
        if (scanData.echographie.adenopathieMesure)
          adenLines.push(`Mesure : ${scanData.echographie.adenopathieMesure} mm`);
        drawSignesBlock("Adénopathie axillaire — détail", adenLines);
      }

      // ── CONCLUSION ───────────────────────────────────────────────────
      checkNewPage(35);
      doc.setFillColor(27, 43, 107);
      doc.rect(margin, y, contentW, 6, "F");
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
      doc.text("CONCLUSION — CLASSIFICATION BI-RADS ACR 2013", margin + 3, y + 4);
      y += 6;

      if (acrD || acrG) {
        const cardW = acrD && acrG ? (contentW - 4) / 2 : contentW;
        const cards = [];
        if (acrD) cards.push({ label: "SEIN DROIT", acr: acrD, reco: recoD });
        if (acrG) cards.push({ label: "SEIN GAUCHE", acr: acrG, reco: recoG });
        const cardH = 22;
        cards.forEach((card, ci) => {
          const xCard = margin + ci * (cardW + 4);
          const acrNum = parseInt(card.acr[0]);
          const cardColor: [number, number, number] =
            acrNum <= 2 ? [22, 163, 74] :
            acrNum === 3 ? [202, 138, 4] :
            acrNum === 4 ? [234, 88, 12] : [220, 38, 38];
          doc.setFillColor(238, 242, 247);
          doc.setDrawColor(...cardColor);
          doc.roundedRect(xCard, y, cardW, cardH, 2, 2, "FD");
          // Header card
          doc.setFillColor(...cardColor);
          doc.roundedRect(xCard, y, cardW, 7, 2, 2, "F");
          doc.rect(xCard, y + 3, cardW, 4, "F");
          doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
          doc.text(card.label, xCard + cardW / 2, y + 5, { align: "center" });
          // ACR badge
          doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(...cardColor);
          doc.text(`ACR ${card.acr}`, xCard + cardW / 2, y + 15, { align: "center" });
          // Recommandation
          if (card.reco) {
            const recoTxt = doc.splitTextToSize(card.reco, cardW - 4);
            doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60);
            // Only first line to fit in card
            doc.text(recoTxt[0] || "", xCard + cardW / 2, y + 21, { align: "center" });
          }
        });
        y += cardH + 4;
        // Recommandation complète si ACR 3
        cards.forEach(card => {
          if (card.acr === "3" && card.reco && card.reco.length > 30) {
            checkNewPage(10);
            const recoFull = doc.splitTextToSize(`${card.label} — ${card.reco}`, contentW - 6);
            doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.setTextColor(100, 100, 100);
            doc.text(recoFull, margin + 3, y);
            y += recoFull.length * 4 + 2;
          }
        });
      } else {
        const acrNum = parseInt((acrGlobal || "1")[0]);
        const globalColor: [number, number, number] =
          acrNum <= 2 ? [22, 163, 74] :
          acrNum === 3 ? [202, 138, 4] :
          acrNum === 4 ? [234, 88, 12] : [220, 38, 38];
        doc.setFillColor(238, 242, 247);
        doc.setDrawColor(...globalColor);
        doc.roundedRect(margin, y, contentW, 16, 2, 2, "FD");
        doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(...globalColor);
        doc.text(`ACR ${acrGlobal}`, margin + 10, y + 10);
        doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(30, 30, 30);
        doc.text(conduiteGlobale || "—", margin + 35, y + 10);
        y += 20;
      }

      // ── SIGNATURE ────────────────────────────────────────────────────
      checkNewPage(25);
      y += 5;
      doc.setDrawColor(27, 43, 107);
      doc.line(margin, y, pageW - margin, y);
      y += 5;
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(27, 43, 107);
      doc.text(drName, margin, y);
      doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
      doc.text("Médecin Radiologue", margin, y + 5);
      doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
      doc.text(`Effectué le ${today}`, pageW - margin, y, { align: "right" });
      // Cachet
      doc.setDrawColor(27, 43, 107);
      doc.circle(pageW / 2, y + 8, 8, "S");
      doc.setFontSize(6); doc.setFont("helvetica", "bold"); doc.setTextColor(27, 43, 107);
      doc.text("CACHET", pageW / 2, y + 7, { align: "center" });
      doc.text("MÉDICAL", pageW / 2, y + 11, { align: "center" });

      const pdfBase64 = doc.output("datauristring").split(",")[1];

      // ── Appel backend ─────────────────────────────────────────────────
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://medecine-cancer-back.onrender.com";
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/mail/send-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          recipients,
          patientName,
          doctorName: drName,
          date: today,
          acrDroit: acrD,
          acrGauche: acrG,
          recommendationDroit: recoD,
          recommendationGauche: recoG,
          acrGlobal,
          conduiteGlobale,
          pdfBase64,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      alert(`Rapport envoyé avec succès à ${recipients.join(" et ")}.`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du rapport : " + (err as Error).message);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const now = new Date();
  const formatDate = () =>
    now.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const formatTime = () =>
    now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const doctorName =
    user?.nom && user?.prenom ? `${user.prenom} ${user.nom}` : user?.nom || "Médecin Radiologue";

  // ── Résultats IA par sein ─────────────────────────────────────────────────
  const fullResponse =
    scanData.resultats?.fullAiResponse || scanData.resultats?.conclusionIA || "";
  const parsed = parsePerBreastResults(fullResponse, scanData.resultats?.conduiteATenir);

  const acrDroit = scanData.resultats?.acrDroit || parsed.acrDroit;
  const acrGauche = scanData.resultats?.acrGauche || parsed.acrGauche;
  const recoDroit = scanData.resultats?.recommendationDroit || parsed.recoDroit;
  const recoGauche = scanData.resultats?.recommendationGauche || parsed.recoGauche;

  // ACR global (le plus élevé des deux)
  const acrGlobal = scanData.resultats?.acrScore || (acrDroit || acrGauche || "—");

  // Seins qui ont effectivement des masses
  const seinsAvecMasses: string[] = scanData.resultats?.seinsAvecMasses || (() => {
    const masses = [
      ...(scanData.mammographie?.masses || []),
      ...(scanData.echographie?.masses || []),
    ];
    const s = new Set<string>();
    masses.forEach((m: { sein?: string }) => {
      if (m.sein?.toLowerCase().includes("droit")) s.add("droit");
      if (m.sein?.toLowerCase().includes("gauche")) s.add("gauche");
    });
    if (s.size === 0 && masses.length > 0) { s.add("droit"); s.add("gauche"); }
    // Fallback sur les scores IA
    if (s.size === 0) {
      if (acrDroit) s.add("droit");
      if (acrGauche) s.add("gauche");
    }
    return Array.from(s);
  })();

  // Nombre de seins classés (pour layout conclusion)
  const seinsClasses = [acrDroit, acrGauche].filter(Boolean).length;
  const seinUnique = seinsClasses === 1;

  // Toutes les masses (mammo + écho) DÉDUPLIQUÉES par sein+localisation
  // (mammo et écho décrivent les MÊMES lésions → ne pas les compter en double)
  const allMasses: Array<{ localisation?: string; sein?: string; mesure?: string }> = (() => {
    const mammo = scanData.mammographie?.masses || [];
    const echo  = scanData.echographie?.masses?.map((m) => ({ ...m })) || [];
    // Prendre les masses mammo comme base
    const result = [...mammo];
    // Ajouter les masses écho uniquement si aucune masse mammo n'a la même localisation + sein
    const mammoKeys = new Set(mammo.map((m) => `${(m.sein || "").toLowerCase()}_${(m.localisation || "").toLowerCase()}`));
    for (const m of echo) {
      const key = `${(m.sein || "").toLowerCase()}_${(m.localisation || "").toLowerCase()}`;
      if (!mammoKeys.has(key)) {
        result.push(m);
      }
    }
    return result;
  })();

  // Helper signes associés — rendu ligne par ligne avec localisation
  const renderSignesAssocies = (
    signes?: Array<{ nom: string; localisation?: string }> | string[]
  ): React.ReactNode => {
    if (!signes || signes.length === 0) return null;
    if (typeof signes[0] === "string") {
      // Format string[] — la localisation peut être déjà dans la string "signe (loc)"
      return (signes as string[]).map((s, i) => (
        <div key={i} style={{ marginBottom: "2px" }}>• {s}</div>
      ));
    }
    return (signes as Array<{ nom: string; localisation?: string }>).map((s, i) => (
      <div key={i} style={{ marginBottom: "2px" }}>
        • {s.nom}{s.localisation ? <span style={{ color: "#555" }}> — <em>{s.localisation}</em></span> : null}
      </div>
    ));
  };

  type SigneItem = { nom: string; localisation?: string } | string;

  return (
    <>
      <style>{`
        /* ===== INTERFACE (non imprimée) ===== */
        .mr-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000; padding: 20px;
        }
        .mr-modal {
          background: white; border-radius: 8px;
          max-width: 820px; width: 100%;
          max-height: 95vh; overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .mr-actions {
          background: #f8fafc; padding: 12px 20px;
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid #e2e8f0;
          font-family: -apple-system, sans-serif;
        }
        .mr-print-btn {
          padding: 8px 20px; background: #1B2B6B; color: white;
          border: none; border-radius: 6px; cursor: pointer;
          font-size: 13px; font-weight: 600;
          font-family: -apple-system, sans-serif;
          display: flex; align-items: center; gap: 6px;
        }
        .mr-close-btn {
          padding: 8px 20px; background: #64748b; color: white;
          border: none; border-radius: 6px; cursor: pointer;
          font-size: 13px; font-family: -apple-system, sans-serif;
        }
        .mr-content { overflow-y: auto; flex: 1; padding: 0; }

        /* ===== FEUILLE DU RAPPORT ===== */
        .mr-page {
          width: 100%; max-width: 760px;
          margin: 0 auto; padding: 20px 30px;
          background: white;
          font-size: 11px; line-height: 1.5;
          color: #000;
          font-family: 'Times New Roman', serif;
        }

        /* EN-TÊTE */
        .mr-header-top {
          display: flex; justify-content: space-between; align-items: flex-start;
          border-bottom: 2px solid #1B2B6B;
          padding-bottom: 10px; margin-bottom: 10px;
        }
        .mr-hospital-info { flex: 1; }
        .mr-hospital-info p { margin: 1px 0; font-size: 10px; }
        .mr-hospital-name { font-size: 12px; font-weight: bold; color: #1B2B6B; margin-bottom: 4px; }
        .mr-doctor-name { font-size: 13px; font-weight: bold; color: #1B2B6B; }
        .mr-title-center { flex: 1; text-align: center; }
        .mr-main-title {
          font-size: 14px; font-weight: bold;
          text-decoration: underline; text-transform: uppercase;
          color: #000; margin: 0 0 6px;
        }
        .mr-sub-title { font-size: 13px; font-weight: bold; color: #1B2B6B; margin: 0; }
        .mr-date-right { flex: 1; text-align: right; font-size: 10px; }

        /* INFO PATIENT */
        .mr-patient-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 2px 20px;
          border: 1px solid #000; padding: 8px 10px;
          margin-bottom: 8px; font-size: 10px;
        }
        .mr-patient-row { display: flex; gap: 6px; }
        .mr-patient-label { font-weight: bold; min-width: 110px; }
        .mr-patient-value { flex: 1; border-bottom: 1px solid #ccc; }

        /* SECTION TITRE */
        .mr-section-title {
          background: #1B2B6B; color: white;
          padding: 3px 8px; font-size: 11px;
          font-weight: bold; text-transform: uppercase;
          margin: 8px 0 4px; letter-spacing: 0.5px;
        }

        /* RENSEIGNEMENTS */
        .mr-clinical {
          border: 1px solid #ccc; padding: 6px 10px;
          margin-bottom: 8px; min-height: 30px; font-size: 10px;
        }

        /* BLOC FUSIONNÉ MAMMO / ECHO */
        .mr-fused-block {
          border: 1px solid #ccc;
          margin-bottom: 8px;
        }
        .mr-fused-block-header {
          background: #EEF2F7;
          padding: 4px 8px;
          font-size: 10px; font-weight: bold; color: #1B2B6B;
          border-bottom: 1px solid #ccc;
        }
        .mr-fused-block-body { padding: 6px 8px; }
        .mr-result-line { font-size: 10px; margin: 2px 0; }

        /* TABLEAU MASSES */
        .mr-masses-table {
          width: 100%; border-collapse: collapse;
          font-size: 10px; margin-top: 6px;
        }
        .mr-masses-table th {
          background: #EEF2F7; border: 1px solid #ccc;
          padding: 3px 5px; text-align: left;
          font-weight: bold; color: #1B2B6B;
        }
        .mr-masses-table td { border: 1px solid #ccc; padding: 3px 5px; }
        .mr-masses-table tr:nth-child(even) td { background: #FAFAFA; }

        /* CONCLUSION PAR SEIN */
        .mr-conclusion-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8px; margin: 8px 0;
        }
        .mr-conclusion-single {
          display: grid; grid-template-columns: minmax(0, 320px);
          gap: 8px; margin: 8px 0; justify-content: center;
        }
        .mr-sein-card {
          border: 2px solid #1B2B6B;
          border-radius: 6px; overflow: hidden;
        }
        .mr-sein-card-header {
          background: #1B2B6B; color: white;
          padding: 4px 8px; font-size: 11px; font-weight: bold;
          text-align: center; text-transform: uppercase;
        }
        .mr-sein-card-body { padding: 8px 10px; }
        .mr-acr-badge-large {
          display: inline-block;
          padding: 3px 12px; border-radius: 4px;
          font-size: 14px; font-weight: bold;
          color: white; margin-bottom: 4px;
        }
        .mr-reco-text { font-size: 9.5px; color: #333; margin-top: 4px; }

        /* CONCLUSION GLOBALE */
        .mr-conclusion {
          border: 2px solid #1B2B6B; padding: 8px 10px; margin: 8px 0;
        }
        .mr-conclusion-title {
          font-weight: bold; font-size: 12px;
          color: #1B2B6B; margin-bottom: 4px; text-transform: uppercase;
        }
        .mr-acr-badge {
          display: inline-block;
          background: #1B2B6B; color: white;
          padding: 2px 10px; border-radius: 4px;
          font-size: 13px; font-weight: bold; margin-right: 8px;
        }
        .mr-conduite { font-weight: bold; color: #1B2B6B; font-size: 11px; }

        /* MONTRE MAMMAIRE */
        .mr-clock-section {
          border: 1px solid #ccc; margin-bottom: 8px;
        }
        .mr-clock-body {
          display: flex; justify-content: space-around;
          align-items: flex-start; padding: 10px;
          gap: 20px;
        }

        /* SIGNATURE */
        .mr-signature {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-top: 16px; padding-top: 8px; border-top: 1px solid #000;
        }
        .mr-sig-left { font-size: 10px; }
        .mr-sig-stamp {
          width: 80px; height: 80px; border: 2px solid #1B2B6B; border-radius: 50%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          font-size: 9px; font-weight: bold; color: #1B2B6B; text-align: center;
        }
        .mr-sig-right { text-align: right; font-size: 10px; }
        .mr-sig-line { width: 150px; border-bottom: 1px solid #000; margin: 20px 0 4px auto; }

        /* ===== IMPRESSION ===== */
        @media print {
          body * { visibility: hidden; }
          .mr-page, .mr-page * { visibility: visible; }
          .mr-page {
            position: fixed; top: 0; left: 0;
            width: 100%; padding: 10px 20px;
          }
          .mr-actions { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="mr-overlay">
        <div className="mr-modal">

          {/* Barre d'actions */}
          <div className="mr-actions">
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#1B2B6B", fontFamily: "inherit" }}>
              Compte Rendu Médical
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="mr-print-btn" onClick={() => window.print()}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Imprimer
              </button>
              <button
                className="mr-send-btn"
                onClick={handleSendEmail}
                disabled={sending}
                style={{ padding: "8px 16px", background: sending ? "#94a3b8" : "#16a34a", color: "white", border: "none", borderRadius: "6px", cursor: sending ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}
              >
                {sending ? (
                  <><div style={{ width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 1s linear infinite" }}/> Envoi...</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Envoyer le rapport</>
                )}
              </button>
              <button className="mr-close-btn" onClick={onClose}>✕ Fermer</button>
            </div>
          </div>

          <div className="mr-content">
            <div className="mr-page">

              {/* ── EN-TÊTE ── */}
              <div className="mr-header-top">
                <div className="mr-hospital-info">
                  <p style={{ fontSize: "9px", color: "#555" }}>République Tunisienne</p>
                  <p style={{ fontSize: "9px", color: "#555" }}>Ministère de la Santé</p>
                  <p className="mr-hospital-name">HÔPITAL RÉGIONAL KSAR HELLAL</p>
                  <p style={{ fontSize: "9px", color: "#555" }}>Service d'Imagerie Médicale</p>
                  <p className="mr-doctor-name">Professeur {doctorName}</p>
                </div>
                <div className="mr-title-center">
                  <p className="mr-main-title">Compte-Rendu d'Examen Radiologique</p>
                  <p className="mr-sub-title">ECHO MAMMOGRAPHIE</p>
                </div>
                <div className="mr-date-right">
                  <p><strong>Date :</strong> {formatDate()}</p>
                  <p><strong>Heure :</strong> {formatTime()}</p>
                  {scanData.scanId && <p><strong>N° Dossier :</strong> {scanData.scanId}</p>}
                </div>
              </div>

              {/* ── INFO PATIENT ── */}
              <div className="mr-patient-grid">
                <div className="mr-patient-row">
                  <span className="mr-patient-label">Bénéficiaire :</span>
                  <span className="mr-patient-value">
                    {scanData.clientInfo?.nom?.toUpperCase()} {scanData.clientInfo?.prenom?.toUpperCase()}
                  </span>
                </div>
                <div className="mr-patient-row">
                  <span className="mr-patient-label">Date de naissance :</span>
                  <span className="mr-patient-value">{scanData.clientInfo?.dateNaissance || "—"}</span>
                </div>
                <div className="mr-patient-row">
                  <span className="mr-patient-label">Téléphone :</span>
                  <span className="mr-patient-value">{scanData.clientInfo?.telephone || "—"}</span>
                </div>
                <div className="mr-patient-row">
                  <span className="mr-patient-label">Service demandeur :</span>
                  <span className="mr-patient-value">SERVICE EXTERNE</span>
                </div>
              </div>

              {/* ── RENSEIGNEMENTS CLINIQUES ── */}
              <div className="mr-section-title">Renseignements Cliniques</div>
              <div className="mr-clinical">
                {scanData.clientInfo?.renseignementsCliniques || "—"}
              </div>

              {/* ── MAMMOGRAPHIE ── */}
              <div className="mr-section-title">Résultat — Mammographie</div>
              <div className="mr-fused-block">
                <div className="mr-fused-block-body">
                  <div className="mr-result-line">
                    Densité mammaire : <strong>{scanData.mammographie?.densiteMammaire || "—"}</strong>
                  </div>
                </div>

                {scanData.mammographie?.masses && scanData.mammographie.masses.length > 0 && (
                  <>
                    <div className="mr-fused-block-header" style={{ borderTop: "1px solid #ccc" }}>
                      Masses détectées ({scanData.mammographie.masses.length})
                    </div>
                    <div className="mr-fused-block-body">
                      <table className="mr-masses-table">
                        <thead>
                          <tr>
                            <th>Masse n°</th>
                            <th>Localisation</th>
                            <th>Sein</th>
                            <th>Forme</th>
                            <th>Contours</th>
                            <th>Densité</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scanData.mammographie.masses.map((masse, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{masse.localisation || "—"}</td>
                              <td>{masse.sein || "—"}</td>
                              <td>{masse.forme || "—"}</td>
                              <td>{masse.contours || "—"}</td>
                              <td>{masse.densite || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                <div className="mr-fused-block-header" style={{ borderTop: "1px solid #ccc" }}>
                  Résultats complémentaires
                </div>
                <div className="mr-fused-block-body">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
                    <div className="mr-result-line">
                      Asymétrie :{" "}
                      <strong>
                        {scanData.mammographie?.asymetrie
                          ? `Oui — ${scanData.mammographie.typeAsymetrie || ""}${
                              scanData.mammographie.localisationAsymetrie
                                ? ` (${scanData.mammographie.localisationAsymetrie})`
                                : ""
                            }`
                          : "Non"}
                      </strong>
                    </div>
                    <div className="mr-result-line">
                      Distorsion architecturale :{" "}
                      <strong>
                        {scanData.mammographie?.distorsionArchitecturale
                          ? `Oui${
                              scanData.mammographie.localisationDistorsion
                                ? ` — ${scanData.mammographie.localisationDistorsion}`
                                : ""
                            }`
                          : "Non"}
                      </strong>
                    </div>
                    <div className="mr-result-line" style={{ gridColumn: "1 / -1" }}>
                      Calcifications :{" "}
                      <strong>
                        {scanData.mammographie?.calcifications
                          ? "Oui"
                          : "Non"}
                      </strong>
                      {scanData.mammographie?.calcifications && (
                        <div style={{ marginTop: "4px", paddingLeft: "12px", fontSize: "9.5px", color: "#333" }}>
                          {scanData.mammographie.typesCalcifications && (
                            <div>Type : <strong>{scanData.mammographie.typesCalcifications}</strong></div>
                          )}
                          {scanData.mammographie.localisationCalcifications && (
                            <div>Localisation : <strong>{scanData.mammographie.localisationCalcifications}</strong></div>
                          )}
                          {scanData.mammographie.calcificationsBenignes && (
                            <div>Bénignes : <strong>{scanData.mammographie.calcificationsBenignes}</strong></div>
                          )}
                          {scanData.mammographie.calcificationsSuspectes && (
                            <div>Suspectes : <strong>{scanData.mammographie.calcificationsSuspectes}</strong></div>
                          )}
                          {scanData.mammographie.distributionMicrocalcifications && (
                            <div>Distribution : <strong>{scanData.mammographie.distributionMicrocalcifications}</strong></div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {scanData.mammographie?.signesAssocies &&
                  (scanData.mammographie.signesAssocies as SigneItem[]).length > 0 && (
                    <>
                      <div className="mr-fused-block-header" style={{ borderTop: "1px solid #ccc" }}>
                        Signes associés
                      </div>
                      <div className="mr-fused-block-body">
                        {renderSignesAssocies(
                          scanData.mammographie.signesAssocies as
                            | Array<{ nom: string; localisation?: string }>
                            | string[]
                        )}
                      </div>
                    </>
                  )}
              </div>

              {/* ── ÉCHOGRAPHIE ── */}
              <div className="mr-section-title">Résultat — Échographie</div>
              <div className="mr-fused-block">
                <div className="mr-fused-block-body">
                  <div className="mr-result-line">
                    Échostructure mammaire :{" "}
                    <strong>{scanData.echographie?.echostructureMammaire || "—"}</strong>
                  </div>
                </div>

                {scanData.echographie?.masses && scanData.echographie.masses.length > 0 && (
                  <>
                    <div className="mr-fused-block-header" style={{ borderTop: "1px solid #ccc" }}>
                      Masses détectées ({scanData.echographie.masses.length})
                    </div>
                    <div className="mr-fused-block-body">
                      <table className="mr-masses-table">
                        <thead>
                          <tr>
                            <th>Masse n°</th>
                            <th>Localisation</th>
                            <th>Rayon horaire</th>
                            <th>Sein</th>
                            <th>Mesure</th>
                            <th>Dist. mamelon</th>
                            <th>Forme</th>
                            <th>Contours</th>
                            <th>Échostructure</th>
                            <th>Orientation</th>
                            <th>Comportement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scanData.echographie.masses.map((masse, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{masse.localisation || "—"}</td>
                              <td>{masse.rayonHoraire || "—"}</td>
                              <td>{masse.sein || "—"}</td>
                              <td>{masse.mesure ? `${masse.mesure} mm` : "—"}</td>
                              <td>{masse.distanceCentre ? `${masse.distanceCentre} mm` : "—"}</td>
                              <td>{masse.forme || "—"}</td>
                              <td>{masse.contours || "—"}</td>
                              <td>{masse.densite || "—"}</td>
                              <td>{masse.orientation || "—"}</td>
                              <td>{masse.comportement || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {((scanData.echographie?.signesAssocies &&
                  (scanData.echographie.signesAssocies as SigneItem[]).length > 0) ||
                  (scanData.echographie?.casSpeciaux &&
                    scanData.echographie.casSpeciaux.length > 0)) && (
                  <>
                    <div className="mr-fused-block-header" style={{ borderTop: "1px solid #ccc" }}>
                      Signes associés / Cas spéciaux
                    </div>
                    <div className="mr-fused-block-body">
                      {scanData.echographie?.signesAssocies &&
                        (scanData.echographie.signesAssocies as SigneItem[]).length > 0 && (
                          <div style={{ marginBottom: "4px" }}>
                            <div style={{ fontWeight: "bold", fontSize: "10px", color: "#1B2B6B", marginBottom: "2px" }}>
                              Signes associés :
                            </div>
                            {renderSignesAssocies(
                              scanData.echographie.signesAssocies as
                                | Array<{ nom: string; localisation?: string }>
                                | string[]
                            )}
                          </div>
                        )}
                      {scanData.echographie?.casSpeciaux &&
                        scanData.echographie.casSpeciaux.length > 0 && (
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: "10px", color: "#1B2B6B", marginBottom: "2px" }}>
                              Cas spéciaux :
                            </div>
                            {scanData.echographie.casSpeciaux.map((c, i) => (
                              <div key={i} style={{ marginBottom: "2px" }}>
                                • {c.nom}
                                {c.localisation ? (
                                  <span style={{ color: "#555" }}> — <em>{c.localisation}</em></span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      {/* Détail adénopathie axillaire */}
                      {scanData.echographie?.adenopathieLocalisation && (
                        <div style={{ marginTop: "6px", padding: "8px 10px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                          <div style={{ fontWeight: "bold", fontSize: "10px", color: "#1B2B6B", marginBottom: "4px" }}>
                            Adénopathie axillaire — détail :
                          </div>
                          <div style={{ fontSize: "9.5px", color: "#333" }}>
                            <div>Localisation : <strong>{scanData.echographie.adenopathieLocalisation}</strong></div>
                            {scanData.echographie.adenopathieChaineBerg && (
                              <div>Chaîne de Berg : <strong>{scanData.echographie.adenopathieChaineBerg}</strong></div>
                            )}
                            {scanData.echographie.adenopathieNombre && (
                              <div>Nombre : <strong>{scanData.echographie.adenopathieNombre}</strong></div>
                            )}
                            {scanData.echographie.adenopathieMesure && (
                              <div>Mesure : <strong>{scanData.echographie.adenopathieMesure} mm</strong></div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* ── CARTOGRAPHIE MAMMAIRE (Montre) ── */}
              {allMasses.length > 0 && (
                <>
                  <div className="mr-section-title">CARTOGRAPHIE DES LÉSIONS</div>
                  <div className="mr-clock-section">
                    <div className="mr-clock-body">
                      <BreastClockDiagram
                        masses={allMasses}
                        sein="droit"
                        label="SEIN DROIT"
                      />
                      <div
                        style={{
                          borderLeft: "1px dashed #ccc",
                          alignSelf: "stretch",
                          margin: "0 10px",
                        }}
                      />
                      <BreastClockDiagram
                        masses={allMasses}
                        sein="gauche"
                        label="SEIN GAUCHE"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ── CONCLUSION PAR SEIN ── */}
              <div className="mr-section-title">Conclusion — Classification BI-RADS ACR 2013</div>

              {(acrDroit || acrGauche) ? (
                <div className={seinUnique ? "mr-conclusion-single" : "mr-conclusion-grid"}>
                  {/* Sein droit — seulement si classé */}
                  {acrDroit && (
                    <div className="mr-sein-card">
                      <div className="mr-sein-card-header">Sein Droit</div>
                      <div className="mr-sein-card-body">
                        <div>
                          <span className="mr-acr-badge-large" style={{ background: acrColor(acrDroit) }}>
                            ACR {acrDroit}
                          </span>
                        </div>
                        {recoDroit && (
                          <div className="mr-reco-text">
                            <strong>Recommandation :</strong> {recoDroit}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sein gauche — seulement si classé */}
                  {acrGauche && (
                    <div className="mr-sein-card">
                      <div className="mr-sein-card-header">Sein Gauche</div>
                      <div className="mr-sein-card-body">
                        <div>
                          <span className="mr-acr-badge-large" style={{ background: acrColor(acrGauche) }}>
                            ACR {acrGauche}
                          </span>
                        </div>
                        {recoGauche && (
                          <div className="mr-reco-text">
                            <strong>Recommandation :</strong> {recoGauche}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback : affichage global si l'IA n'a pas renvoyé par sein */
                <div className="mr-conclusion">
                  <p style={{ fontSize: "11px", margin: "4px 0" }}>
                    <span className="mr-acr-badge">ACR {acrGlobal}</span>
                    <span className="mr-conduite">{scanData.resultats?.conduiteATenir || "—"}</span>
                  </p>
                </div>
              )}

              {/* ── SIGNATURE ── */}
              <div className="mr-signature">
                <div className="mr-sig-left">
                  <p style={{ margin: "1px 0" }}>
                    <strong>Effectué le :</strong> {formatDate()} à {formatTime()}
                  </p>
                  <p style={{ margin: "1px 0" }}>
                    <strong>Validé par :</strong> {doctorName}
                  </p>
                </div>
                <div className="mr-sig-stamp">
                  <span>CACHET</span>
                  <span>MÉDICAL</span>
                </div>
                <div className="mr-sig-right">
                  <div className="mr-sig-line"></div>
                  <p style={{ margin: "2px 0", fontSize: "10px" }}>Dr. {doctorName}</p>
                  <p style={{ margin: "2px 0", fontSize: "9px", color: "#555" }}>Médecin Radiologue</p>
                </div>
              </div>

            </div>{/* fin .mr-page */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalReport;