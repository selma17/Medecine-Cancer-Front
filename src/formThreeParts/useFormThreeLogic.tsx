/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../config";

const detectSeinsAvecMasses = (scan: any): string[] => {
  const masses = [
    ...(scan.massesMammographie || []),
    ...(scan.massesEchostructure || []),
  ];
  const seins = new Set<string>();
  masses.forEach((m: any) => {
    if (m.sein) {
      const s = m.sein.toLowerCase();
      if (s.includes("droit")) seins.add("droit");
      if (s.includes("gauche")) seins.add("gauche");
    }
  });
  if (seins.size === 0 && masses.length > 0) {
    seins.add("droit");
    seins.add("gauche");
  }
  return Array.from(seins);
};

const transformScanDataForReport = (scan: any, clientDetails?: any) => {
    return {
      scanId: scan.id?.toString(),
      clientInfo: scan.client ? {
        nom:    scan.client.nom,
        prenom: scan.client.prenom,
        dateNaissance: clientDetails?.dateNaissance || scan.client.dateNaissance || null,
        telephone:     clientDetails?.telephone     || scan.client.telephone     || null,
        renseignementsCliniques:
          clientDetails?.renseignementsCliniques || scan.client.renseignementsCliniques,
      } : null,
      mammographie: {
        densiteMammaire:          scan.densiteMammaire,
        asymetrie:                scan.asymetrie,
        typeAsymetrie:            scan.typeAsymetrie,
        localisationAsymetrie:    scan.localisationAsymetrie,
        distorsionArchitecturale: scan.distorsionArchitecturale,
        localisationDistorsion:   scan.localisationDistorsion,
        calcifications:           scan.calcifications,
        typesCalcifications:      scan.typesCalcifications,
        localisationCalcifications: scan.localisationCalcifications,
        signesAssocies:           scan.signesAssociesMammographie || [],
        masses: scan.massesMammographie?.map((m: any) => ({
          localisation: m.localisation,
          forme:        m.forme,
          contours:     m.contours,
          densite:      m.densite,
          sein:         m.sein,
        })) || [],
      },
      echographie: {
        echostructureMammaire: scan.echostructureMammaire,
        signesAssocies:        scan.signesAssociesEchostructure || [],
        casSpeciaux:           scan.casSpeciaux || [],
        masses: scan.massesEchostructure?.map((m: any) => ({
          localisation:   m.localisation,
          distanceCentre: m.distanceCentre,
          mesure:         m.mesure,
          forme:          m.forme,
          contours:       m.contours,
          densite:        m.densite,
          orientation:    m.orientation,
          comportement:   m.comportementDesFaisceauxUltrasons,
          calcifications: m.calcifications,
          sein:           m.sein,
        })) || [],
      },
      resultats: {
        acrScore:           scan.conclusionIA,
        acrType:            scan.acrType,
        conclusionIA:       scan.conclusionIA,
        conduiteATenir:     scan.conduiteATenir,
        // Par sein
        acrDroit:              scan.acrDroit           || "",
        acrGauche:             scan.acrGauche          || "",
        recommendationDroit:   scan.recommandationDroit  || "",
        recommendationGauche:  scan.recommandationGauche || "",
        fullAiResponse:        scan.fullAiResponse       || "",
        // Seins qui ont effectivement des masses
        seinsAvecMasses:       detectSeinsAvecMasses(scan),
      },
    };
  };

export const useFormThreeLogic = (navigate: ReturnType<typeof useNavigate>) => {
  const location = useLocation();
  const { scanId } = location.state || {};

  const [conclusionIA, setConclusionIA]       = useState<string>("");
  const [conduiteIA, setConduiteIA]           = useState<string>("");
  const [justificationIA, setJustificationIA] = useState<string>("");
  const [acrType, setAcrType]                 = useState<string>("");
  const [acrScore, setAcrScore]               = useState<string>("");

  // ── Nouveaux états par sein ──────────────────────────────────────────────
  const [acrDroit, setAcrDroit]                       = useState<string>("");
  const [acrGauche, setAcrGauche]                     = useState<string>("");
  const [recommandationDroit, setRecommandationDroit] = useState<string>("");
  const [recommandationGauche, setRecommandationGauche] = useState<string>("");

  const [loadingIA, setLoadingIA]             = useState<boolean>(true);
  const [scanData, setScanData]               = useState<any>(null);
  const [showMedicalReport, setShowMedicalReport] = useState<boolean>(false);

  const steps = [
    { title: "Mammographie", status: "completed" as const },
    { title: "Échographie",  status: "completed" as const },
    { title: "Conclusion",   status: "in-progress" as const },
  ];

  
    useEffect(() => {
    if (scanId) {
      axios.get(`${API_BASE_URL}/api/mammary-scan/${scanId}`)
        .then(async (response) => {
          const scan = response.data;

          setConclusionIA(scan.conclusionIA     || "");
          setConduiteIA(scan.conduiteATenir     || "");
          setJustificationIA(scan.justificationIA || scan.justification || "");
          setAcrType(scan.acrType               || "");
          setAcrScore(scan.conclusionIA         || "");

          // Par sein
          setAcrDroit(scan.acrDroit                   || "");
          setAcrGauche(scan.acrGauche                  || "");
          setRecommandationDroit(scan.recommandationDroit   || "");
          setRecommandationGauche(scan.recommandationGauche || "");

          // Détails complets du client
          let clientDetails = null;
          if (scan.client?.id) {
            try {
              const clientsRes = await axios.get(`${API_BASE_URL}/api/clients/by-medecin`);
              clientDetails = clientsRes.data.find((c: any) => c.id === scan.client.id);
            } catch (e) {
              console.error("Erreur récupération client:", e);
            }
          }

          setScanData(transformScanDataForReport(scan, clientDetails));
          toast.success("Analyse IA récupérée");
        })
        .catch((error) => {
          console.error("Erreur récupération analyse IA:", error);
          toast.error("Erreur lors de la récupération du scan");
        })
        .finally(() => setLoadingIA(false));
    }
  }, [scanId]);

  const handleSubmit    = () => navigate("/dashboard");
  const openMedicalReport  = () => setShowMedicalReport(true);
  const closeMedicalReport = () => setShowMedicalReport(false);

  return {
    steps,
    conclusionIA,
    conduiteIA,
    justificationIA,
    acrType,
    acrScore,
    acrDroit,
    acrGauche,
    recommandationDroit,
    recommandationGauche,
    loadingIA,
    handleSubmit,
    scanData,
    showMedicalReport,
    openMedicalReport,
    closeMedicalReport,
  };
};