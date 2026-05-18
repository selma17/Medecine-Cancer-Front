/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../config";

export const useFormThreeLogic = (navigate: ReturnType<typeof useNavigate>) => {
  const location = useLocation();
  const { scanId } = location.state || {};

  const [conclusionIA, setConclusionIA] = useState<string>("");
  const [conduiteIA, setConduiteIA] = useState<string>("");
  const [justificationIA, setJustificationIA] = useState<string>("");
  const [acrType, setAcrType] = useState<string>("");
  const [acrScore, setAcrScore] = useState<string>("");
  const [loadingIA, setLoadingIA] = useState<boolean>(true);
  const [scanData, setScanData] = useState<any>(null);
  const [showMedicalReport, setShowMedicalReport] = useState<boolean>(false);

  const steps = [
    { title: "Mammographie", status: "completed" as const },
    { title: "Échographie", status: "completed" as const },
    { title: "Conclusion", status: "in-progress" as const },
  ];

  const transformScanDataForReport = (scan: any, clientDetails?: any) => {
    return {
      scanId: scan.id?.toString(),
      clientInfo: scan.client ? {
        nom: scan.client.nom,
        prenom: scan.client.prenom,
        // Priorité aux détails récupérés séparément
        dateNaissance: clientDetails?.dateNaissance || scan.client.dateNaissance || null,
        telephone: clientDetails?.telephone || scan.client.telephone || null,
        renseignementsCliniques: clientDetails?.renseignementsCliniques || scan.client.renseignementsCliniques
      } : null,
      mammographie: {
        densiteMammaire: scan.densiteMammaire,
        masses: scan.massesMammographie?.map((masse: any) => ({
          localisation: masse.localisation,
          forme: masse.forme,
          contours: masse.contours,
          densite: masse.densite,
          sein: masse.sein,
        })) || [],
        asymetrie: scan.asymetrie,
        typeAsymetrie: scan.typeAsymetrie,
        distorsionArchitecturale: scan.distorsionArchitecturale,
        calcifications: scan.calcifications,
        typesCalcifications: scan.typesCalcifications,
        signesAssocies: scan.signesAssociesMammographie || []
      },
      echographie: {
        echostructureMammaire: scan.echostructureMammaire,
        masses: scan.massesEchostructure?.map((masse: any) => ({
          localisation: masse.localisation,
          mesure: masse.mesure,
          forme: masse.forme,
          contours: masse.contours,
          densite: masse.densite,
          orientation: masse.orientation,
          comportement: masse.comportementDesFaisceauxUltrasons,
          calcifications: masse.calcifications
        })) || [],
        signesAssocies: scan.signesAssociesEchostructure || []
      },
      resultats: {
        acrScore: scan.conclusionIA,
        acrType: scan.acrType,
        conclusionIA: scan.conclusionIA,
        conduiteATenir: scan.conduiteATenir
      }
    };
  };

  useEffect(() => {
    if (scanId) {
      axios.get(`${API_BASE_URL}/api/mammary-scan/${scanId}`)
        .then(async (response) => {
          const scan = response.data;

          setConclusionIA(scan.conclusionIA || "");
          setConduiteIA(scan.conduiteATenir || "");
          setJustificationIA(scan.justificationIA || scan.justification || "");
          setAcrType(scan.acrType || "");
          setAcrScore(scan.conclusionIA || "");

          // ✅ Récupérer les détails complets du client séparément
          let clientDetails = null;
          if (scan.client?.id) {
            try {
              const clientsRes = await axios.get(`${API_BASE_URL}/api/clients/by-medecin`);
              const clients = clientsRes.data;
              clientDetails = clients.find((c: any) => c.id === scan.client.id);
            } catch (e) {
              console.error("Erreur récupération client:", e);
            }
          }

          const transformedData = transformScanDataForReport(scan, clientDetails);
          setScanData(transformedData);
          toast.success("Analyse IA récupérée");
        })
        .catch((error) => {
          console.error("Erreur récupération analyse IA:", error);
          toast.error("Erreur lors de la récupération du scan");
        })
        .finally(() => {
          setLoadingIA(false);
        });
    }
  }, [scanId]);

  // ✅ Redirige directement vers le dashboard
  const handleSubmit = () => {
    navigate("/dashboard");
  };

  const openMedicalReport = () => setShowMedicalReport(true);
  const closeMedicalReport = () => setShowMedicalReport(false);

  return {
    steps,
    conclusionIA,
    conduiteIA,
    justificationIA,
    acrType,
    acrScore,
    loadingIA,
    handleSubmit,
    scanData,
    showMedicalReport,
    openMedicalReport,
    closeMedicalReport,
  };
};