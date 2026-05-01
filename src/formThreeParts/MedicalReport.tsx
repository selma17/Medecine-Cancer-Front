import React from "react";

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
      }>;
      asymetrie?: boolean;
      typeAsymetrie?: string;
      distorsionArchitecturale?: boolean;
      calcifications?: boolean;
      typesCalcifications?: string;
      signesAssocies?: string[];
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
      signesAssocies?: string[];
    };
    resultats?: {
      acrScore?: string;
      acrType?: string;
      conclusionIA?: string;
      justificationIA?: string;
      conduiteATenir?: string;
    };
  };
}

const MedicalReport: React.FC<MedicalReportProps> = ({ isOpen, onClose, scanData }) => {
  if (!isOpen) return null;

  const now = new Date();
  const formatDate = () => now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formatTime = () => now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const doctorName = user?.nom && user?.prenom ? `${user.prenom} ${user.nom}` : (user?.nom || "Médecin Radiologue");

  const extractConduite = (conduite?: string) => {
    if (!conduite) return "—";
    const actions = ["Surveillance", "Biopsie", "Ablation chirurgicale", "Traitement médical"];
    for (const action of actions) {
      if (conduite.includes(action)) return action;
    }
    return conduite.split('\n')[0].substring(0, 50);
  };

  return (
    <>
      <style>{`
        .mr-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000; padding: 20px;
        }
        .mr-modal {
          background: white; border-radius: 8px;
          max-width: 800px; width: 100%;
          max-height: 95vh; overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          font-family: 'Times New Roman', serif;
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
        .mr-content {
          overflow-y: auto; flex: 1;
          padding: 0;
        }
        .mr-page {
          width: 100%; max-width: 760px;
          margin: 0 auto; padding: 20px 30px;
          background: white;
          font-size: 11px; line-height: 1.5;
          color: #000;
        }

        /* EN-TÊTE */
        .mr-header-top {
          display: flex; justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #1B2B6B;
          padding-bottom: 10px; margin-bottom: 10px;
        }
        .mr-hospital-info { flex: 1; }
        .mr-hospital-info p { margin: 1px 0; font-size: 10px; }
        .mr-hospital-name {
          font-size: 12px; font-weight: bold;
          color: #1B2B6B; margin-bottom: 4px;
        }
        .mr-doctor-name {
          font-size: 13px; font-weight: bold;
          color: #1B2B6B;
        }
        .mr-title-center {
          flex: 1; text-align: center;
        }
        .mr-main-title {
          font-size: 14px; font-weight: bold;
          text-decoration: underline;
          text-transform: uppercase;
          color: #000; margin: 0 0 6px;
        }
        .mr-sub-title {
          font-size: 13px; font-weight: bold;
          color: #1B2B6B; margin: 0;
        }
        .mr-date-right {
          flex: 1; text-align: right;
          font-size: 10px;
        }

        /* INFO PATIENT */
        .mr-patient-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 2px 20px;
          border: 1px solid #000;
          padding: 8px 10px;
          margin-bottom: 8px;
          font-size: 10px;
        }
        .mr-patient-row { display: flex; gap: 6px; }
        .mr-patient-label { font-weight: bold; min-width: 100px; }
        .mr-patient-value { flex: 1; border-bottom: 1px solid #ccc; }

        /* SECTION TITRE */
        .mr-section-title {
          background: #1B2B6B; color: white;
          padding: 3px 8px; font-size: 11px;
          font-weight: bold; text-transform: uppercase;
          margin: 8px 0 4px;
          letter-spacing: 0.5px;
        }

        /* RENSEIGNEMENTS CLINIQUES */
        .mr-clinical {
          border: 1px solid #ccc; padding: 6px 10px;
          margin-bottom: 8px; min-height: 30px;
          font-size: 10px;
        }

        /* RÉSULTATS */
        .mr-results-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 6px; margin-bottom: 8px;
        }
        .mr-result-block {
          border: 1px solid #ccc; padding: 6px 8px;
        }
        .mr-result-block-title {
          font-weight: bold; font-size: 10px;
          text-decoration: underline; margin-bottom: 4px;
          color: #1B2B6B;
        }
        .mr-result-line { font-size: 10px; margin: 2px 0; }

        /* MASSES */
        .mr-masses-table {
          width: 100%; border-collapse: collapse;
          font-size: 10px; margin-bottom: 8px;
        }
        .mr-masses-table th {
          background: #EEF2F7; border: 1px solid #ccc;
          padding: 3px 6px; text-align: left;
          font-weight: bold; color: #1B2B6B;
        }
        .mr-masses-table td {
          border: 1px solid #ccc; padding: 3px 6px;
        }

        /* CONCLUSION */
        .mr-conclusion {
          border: 2px solid #1B2B6B; padding: 8px 10px;
          margin: 8px 0;
        }
        .mr-conclusion-title {
          font-weight: bold; font-size: 12px;
          color: #1B2B6B; margin-bottom: 4px;
          text-transform: uppercase;
        }
        .mr-acr-badge {
          display: inline-block;
          background: #1B2B6B; color: white;
          padding: 2px 10px; border-radius: 4px;
          font-size: 13px; font-weight: bold;
          margin-right: 8px;
        }
        .mr-conduite {
          font-weight: bold; color: #1B2B6B;
          font-size: 11px;
        }

        /* SIGNATURE */
        .mr-signature {
          display: flex; justify-content: space-between;
          align-items: flex-end;
          margin-top: 16px; padding-top: 8px;
          border-top: 1px solid #000;
        }
        .mr-sig-left { font-size: 10px; }
        .mr-sig-stamp {
          width: 80px; height: 80px;
          border: 2px solid #1B2B6B; border-radius: 50%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          font-size: 9px; font-weight: bold; color: #1B2B6B;
          text-align: center;
        }
        .mr-sig-right { text-align: right; font-size: 10px; }
        .mr-sig-line {
          width: 150px; border-bottom: 1px solid #000;
          margin: 20px 0 4px auto;
        }

        /* PRINT */
        @media print {
          .mr-overlay { position: static; background: white; padding: 0; }
          .mr-modal { box-shadow: none; max-height: none; border-radius: 0; }
          .mr-actions { display: none !important; }
          .mr-content { overflow: visible; }
          .mr-page { padding: 10px 20px; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="mr-overlay">
        <div className="mr-modal">

          {/* Boutons actions */}
          <div className="mr-actions">
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#1B2B6B" }}>
              Compte Rendu Médical
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="mr-print-btn" onClick={() => window.print()}>
                🖨️ Imprimer
              </button>
              <button className="mr-close-btn" onClick={onClose}>✕ Fermer</button>
            </div>
          </div>

          <div className="mr-content">
            <div className="mr-page">

              {/* EN-TÊTE */}
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

              {/* INFO PATIENT */}
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

              {/* RENSEIGNEMENTS CLINIQUES */}
              <div className="mr-section-title">Renseignements Cliniques</div>
              <div className="mr-clinical">
                {scanData.clientInfo?.renseignementsCliniques || "—"}
              </div>

              {/* RÉSULTATS MAMMOGRAPHIE */}
              <div className="mr-section-title">Résultat — Mammographie</div>
              <div className="mr-results-grid">
                <div className="mr-result-block">
                  <div className="mr-result-block-title">Densité mammaire</div>
                  <div className="mr-result-line">
                    Type : <strong>{scanData.mammographie?.densiteMammaire || "—"}</strong>
                  </div>
                </div>
                <div className="mr-result-block">
                  <div className="mr-result-block-title">Anomalies</div>
                  <div className="mr-result-line">
                    Asymétrie : <strong>{scanData.mammographie?.asymetrie ? `Oui — ${scanData.mammographie.typeAsymetrie || ""}` : "Non"}</strong>
                  </div>
                  <div className="mr-result-line">
                    Distorsion : <strong>{scanData.mammographie?.distorsionArchitecturale ? "Oui" : "Non"}</strong>
                  </div>
                  <div className="mr-result-line">
                    Calcifications : <strong>{scanData.mammographie?.calcifications ? `Oui — ${scanData.mammographie.typesCalcifications || ""}` : "Non"}</strong>
                  </div>
                </div>
              </div>

              {/* SIGNES ASSOCIÉS MAMMOGRAPHIE */}
              {scanData.mammographie?.signesAssocies && scanData.mammographie.signesAssocies.length > 0 && (
                <div className="mr-result-block" style={{ marginBottom: "8px" }}>
                  <div className="mr-result-block-title">Signes associés (Mammographie)</div>
                  <div className="mr-result-line">{scanData.mammographie.signesAssocies.join(", ")}</div>
                </div>
              )}

              {/* MASSES MAMMOGRAPHIE */}
              {scanData.mammographie?.masses && scanData.mammographie.masses.length > 0 && (
                <>
                  <div className="mr-section-title">Masses — Mammographie</div>
                  <table className="mr-masses-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Localisation</th>
                        <th>Sein</th>
                        <th>Distance</th>
                        <th>Forme</th>
                        <th>Contours</th>
                        <th>Densité</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scanData.mammographie.masses.map((masse, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{masse.localisation}</td>
                          <td>{masse.sein || "—"}</td>
                          <td>{masse.distanceCentre ? `${masse.distanceCentre} cm` : "—"}</td>
                          <td>{masse.forme}</td>
                          <td>{masse.contours}</td>
                          <td>{masse.densite}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* RÉSULTATS ÉCHOGRAPHIE */}
              <div className="mr-section-title">Résultat — Échographie</div>
              <div className="mr-result-block" style={{ marginBottom: "8px" }}>
                <div className="mr-result-block-title">Échostructure mammaire</div>
                <div className="mr-result-line">{scanData.echographie?.echostructureMammaire || "—"}</div>
              </div>

              {/* SIGNES ASSOCIÉS ÉCHOGRAPHIE */}
              {scanData.echographie?.signesAssocies && scanData.echographie.signesAssocies.length > 0 && (
                <div className="mr-result-block" style={{ marginBottom: "8px" }}>
                  <div className="mr-result-block-title">Signes associés (Échographie)</div>
                  <div className="mr-result-line">{scanData.echographie.signesAssocies.join(", ")}</div>
                </div>
              )}

              {/* MASSES ÉCHOGRAPHIE */}
              {scanData.echographie?.masses && scanData.echographie.masses.length > 0 && (
                <>
                  <div className="mr-section-title">Masses — Échographie</div>
                  <table className="mr-masses-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Localisation</th>
                        <th>Mesure</th>
                        <th>Forme</th>
                        <th>Contours</th>
                        <th>Densité</th>
                        <th>Orientation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scanData.echographie.masses.map((masse, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{masse.localisation}</td>
                          <td>{masse.mesure ? `${masse.mesure} mm` : "—"}</td>
                          <td>{masse.forme}</td>
                          <td>{masse.contours}</td>
                          <td>{masse.densite}</td>
                          <td>{masse.orientation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* CONCLUSION */}
              <div className="mr-conclusion">
                <div className="mr-conclusion-title">Conclusion</div>
                {scanData.resultats?.conclusionIA && (
                  <p style={{ fontSize: "10px", marginBottom: "6px" }}>
                    {scanData.resultats.conclusionIA}
                  </p>
                )}
                <p style={{ fontSize: "11px", margin: "4px 0" }}>
                  <span className="mr-acr-badge">
                    ACR {scanData.resultats?.acrScore || "—"}
                    {scanData.resultats?.acrType ? ` (Type ${scanData.resultats.acrType})` : ""}
                  </span>
                  <span className="mr-conduite">
                    A {extractConduite(scanData.resultats?.conduiteATenir)}
                  </span>
                </p>
              </div>

              {/* SIGNATURE */}
              <div className="mr-signature">
                <div className="mr-sig-left">
                  <p style={{ margin: "1px 0" }}><strong>Effectué le :</strong> {formatDate()} à {formatTime()}</p>
                  <p style={{ margin: "1px 0" }}><strong>Validé par :</strong> {doctorName}</p>
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

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalReport;