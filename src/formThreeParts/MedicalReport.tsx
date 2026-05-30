import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
        sein?: string;
      }>;
      signesAssocies?: Array<{ nom: string; localisation?: string }> | string[];
      casSpeciaux?: Array<{ nom: string; localisation?: string }>;
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
    if (!m.sein) return true;
    return m.sein.toLowerCase().includes(sein === "droit" ? "droit" : "gauche");
  });

  // Convertir une localisation horaire en angle (12h = haut, sens horaire)
  const heureToAngle = (loc: string): number | null => {
    const match = loc.match(/(\d{1,2})\s*h/i);
    if (!match) return null;
    const h = parseInt(match[1]);
    return ((h % 12) / 12) * 360 - 90; // -90 pour partir du haut
  };

  // Quadrants textuels
  const quadrantAngle = (loc: string): number | null => {
    const l = loc.toLowerCase();
    if (l.includes("sup") && l.includes("ext")) return -45;
    if (l.includes("sup") && l.includes("int")) return -135;
    if (l.includes("inf") && l.includes("ext")) return 45;
    if (l.includes("inf") && l.includes("int")) return 135;
    if (l.includes("quadrant supérieur")) return -90;
    if (l.includes("quadrant inférieur")) return 90;
    if (l.includes("mamelonnaire") || l.includes("central")) return 0;
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
  const reportRef = React.useRef<HTMLDivElement>(null);

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
      const acrGlobal      = scanData.resultats?.acrScore      || "";
      const conduiteGlobale = scanData.resultats?.conduiteATenir || "";
      const today = new Date().toLocaleDateString("fr-FR");

      // ── Capture du rapport affiché via html2canvas ────────────────────
      if (!reportRef.current) throw new Error("Rapport non disponible");

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;

      let heightLeft = imgH;
      let position = 0;
      doc.addImage(imgData, "PNG", 0, position, imgW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position -= pageH;
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgW, imgH);
        heightLeft -= pageH;
      }

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

  const seinUnique = seinsAvecMasses.length === 1;

  // Toutes les masses (mammo + écho combinées pour la montre)
  const allMasses: Array<{ localisation?: string; sein?: string; mesure?: string }> = [
    ...(scanData.mammographie?.masses || []),
    ...(scanData.echographie?.masses?.map((m) => ({ ...m })) || []),
  ];

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
            <div className="mr-page" ref={reportRef}>

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
                <div className="mr-fused-block-header">Données générales</div>
                <div className="mr-fused-block-body">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
                    <div className="mr-result-line">
                      Densité mammaire : <strong>{scanData.mammographie?.densiteMammaire || "—"}</strong>
                    </div>
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
                    <div className="mr-result-line">
                      Calcifications :{" "}
                      <strong>
                        {scanData.mammographie?.calcifications
                          ? `Oui — ${scanData.mammographie.typesCalcifications || ""}${
                              scanData.mammographie.localisationCalcifications
                                ? ` (${scanData.mammographie.localisationCalcifications})`
                                : ""
                            }`
                          : "Non"}
                      </strong>
                    </div>
                  </div>
                  {scanData.mammographie?.signesAssocies &&
                    (scanData.mammographie.signesAssocies as SigneItem[]).length > 0 && (
                      <div className="mr-result-line" style={{ marginTop: "4px" }}>
                        Signes associés :{" "}
                        <strong>{renderSignesAssocies(scanData.mammographie.signesAssocies as Array<{ nom: string; localisation?: string }> | string[])}</strong>
                      </div>
                    )}
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
                            <th>#</th>
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
              </div>

              {/* ── ÉCHOGRAPHIE ── */}
              <div className="mr-section-title">Résultat — Échographie</div>
              <div className="mr-fused-block">
                <div className="mr-fused-block-header">Données générales</div>
                <div className="mr-fused-block-body">
                  <div className="mr-result-line">
                    Échostructure mammaire :{" "}
                    <strong>{scanData.echographie?.echostructureMammaire || "—"}</strong>
                  </div>
                  {scanData.echographie?.signesAssocies &&
                    (scanData.echographie.signesAssocies as SigneItem[]).length > 0 && (
                      <div className="mr-result-line" style={{ marginTop: "4px" }}>
                        Signes associés :{" "}
                        <strong>{renderSignesAssocies(scanData.echographie.signesAssocies as Array<{ nom: string; localisation?: string }> | string[])}</strong>
                      </div>
                    )}
                  {scanData.echographie?.casSpeciaux &&
                    scanData.echographie.casSpeciaux.length > 0 && (
                      <div className="mr-result-line" style={{ marginTop: "4px" }}>
                        Cas spéciaux :{" "}
                        <strong>
                          {scanData.echographie.casSpeciaux
                            .map((c) => (c.localisation ? `${c.nom} (${c.localisation})` : c.nom))
                            .join(", ")}
                        </strong>
                      </div>
                    )}
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
                            <th>#</th>
                            <th>Localisation</th>
                            <th>Sein</th>
                            <th>Mesure</th>
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
                              <td>{masse.sein || "—"}</td>
                              <td>{masse.mesure ? `${masse.mesure} mm` : "—"}</td>
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
              </div>

              {/* ── CARTOGRAPHIE MAMMAIRE (Montre) ── */}
              {allMasses.length > 0 && (
                <>
                  <div className="mr-section-title">Cartographie des lésions — Aide chirurgicale</div>
                  <div className="mr-clock-section">
                    <div
                      className="mr-fused-block-header"
                      style={{ fontSize: "9px", fontStyle: "italic", fontWeight: "normal" }}
                    >
                      Localisation horaire des masses (vue de face, patiente debout).
                      Sein droit : sens horaire patient. Sein gauche : sens horaire miroir.
                    </div>
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
                  {/* Sein droit — seulement si anomalie */}
                  {seinsAvecMasses.includes("droit") && acrDroit && (
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

                  {/* Sein gauche — seulement si anomalie */}
                  {seinsAvecMasses.includes("gauche") && acrGauche && (
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