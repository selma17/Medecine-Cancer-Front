import { useState } from "react";
import { useScanStore } from "../../src/store/useScanStore";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export const useFormTwoLogic = (navigate: ReturnType<typeof useNavigate>) => {
  const { formOneData, clientId } = useScanStore();

  const [nombreMasse, setNombreMasse] = useState<number | "">("");
  const [localisations, setLocalisations] = useState<string[]>([]);
  const [distancesCentre, setDistancesCentre] = useState<string[]>([]);
  const [seins, setSeins] = useState<("gauche" | "droite")[]>([]);
  const [mesures, setMesures] = useState<string[]>([]);
  const [formes, setFormes] = useState<string[]>([]);
  const [contours, setContours] = useState<string[]>([]);
  const [densites, setDensites] = useState<string[]>([]);
  const [orientations, setOrientations] = useState<string[]>([]);
  const [comportements, setComportements] = useState<string[]>([]);
  const [calcifications, setCalcifications] = useState<string[]>([]);
  const [echostructureMammaire, setEchostructureMammaire] = useState<string>("");
  const [signesAssocies, setSignesAssocies] = useState<string[]>([]);
  const [signesLocalisations, setSignesLocalisations] = useState<{ [key: string]: string }>({});
  const [casSpeciaux, setCasSpeciaux] = useState<string[]>([]);
  const [casSpeciauxLocalisations, setCasSpeciauxLocalisations] = useState<{ [key: string]: string }>({});

  const steps = [
    { title: "Mammographie", status: "terminée" as const },
    { title: "Échographie", status: "en cours" as const },
    { title: "Conclusion", status: "en attente" as const },
  ];

  const handleNombreMasseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombreMasse(value === "" ? "" : Math.max(0, Number(value)));
  };

  const handleLocalisationChange = (index: number, value: string) =>
    setLocalisations((prev) => { const arr = [...prev]; arr[index] = value; return arr; });

  const handleDistanceCentreChange = (index: number, value: string) =>
    setDistancesCentre((prev) => { const arr = [...prev]; arr[index] = value; return arr; });

  const handleSeinChange = (index: number, value: "gauche" | "droite") =>
    setSeins((prev) => { const arr = [...prev]; arr[index] = value; return arr; });

  const handleMesureChange = (index: number, value: string) =>
    setMesures((prev) => { const arr = [...prev]; arr[index] = value; return arr; });

  const handleMassesDataChange = (
    index: number,
    field: "forme" | "contour" | "densite" | "orientation" | "comportement" | "calcification",
    value: string
  ) => {
    const setters: { [key: string]: React.Dispatch<React.SetStateAction<string[]>> } = {
      forme: setFormes, contour: setContours, densite: setDensites,
      orientation: setOrientations, comportement: setComportements, calcification: setCalcifications,
    };
    setters[field]((prev) => { const arr = [...prev]; arr[index] = value; return arr; });
  };

  const handleSignesAssociesChange = (selected: string[]) => setSignesAssocies(selected);

  const handleSigneLocalisationChange = (sign: string, value: string) =>
    setSignesLocalisations((prev) => ({ ...prev, [sign]: value }));

  const handleCasSpeciauxChange = (selected: string[]) => setCasSpeciaux(selected);

  const handleCasSpeciauxLocalisationChange = (name: string, localisation: string) =>
    setCasSpeciauxLocalisations((prev) => ({ ...prev, [name]: localisation }));

  const handleEchostructureChange = (value: string) => setEchostructureMammaire(value);

  const handleNextClick = async () => {
    if (!nombreMasse || nombreMasse === 0) {
      toast.error("⚠️ Veuillez définir le nombre de masses échographiques");
      return;
    }

    const massesEchographie = localisations.map((localisation, index) => ({
      localisation: localisation || "",
      distanceCentre: distancesCentre[index] || "",
      sein: seins[index] || "gauche",
      mesure: mesures[index] || "",
      forme: formes[index] || "",
      contours: contours[index] || "",
      densite: densites[index] || "",
      orientation: orientations[index] || "",
      comportementDesFaisceauxUltrasons: comportements[index] || "",
      calcifications: calcifications[index] || "",
    }));

    const hasEchographieData = massesEchographie.some(
      masse => masse.localisation && masse.forme && masse.contours && masse.densite
    );

    if (!hasEchographieData) {
      toast.error("⚠️ Veuillez remplir au moins une masse échographique complète");
      return;
    }

    if (!echostructureMammaire) {
      toast.error("⚠️ Veuillez sélectionner l'échostructure mammaire");
      return;
    }

    const scanData = {
      // ── Mammographie ──────────────────────────────────────────────────────
      densiteMammaire:              formOneData.densiteMammaire || null,
      asymetrie:                    formOneData.asymetrie ?? null,
      typeAsymetrie:                formOneData.typeAsymetrie || null,
      localisationAsymetrie:        formOneData.localisationAsymetrie || null,
      distorsionArchitecturale:     formOneData.distorsionArchitecturale ?? null,
      optionDistorsionArchitecturale: formOneData.optionDistorsionArchitecturale || null,
      localisationDistorsion:       formOneData.localisationDistorsion || null,
      calcifications:               formOneData.calcifications ?? null,
      typesCalcifications:          formOneData.typesCalcifications || null,
      localisationCalcifications:   formOneData.localisationCalcifications || null,
      calcificationsBenignes:       formOneData.calcificationsBenignes || null,
      calcificationsSuspectes:      formOneData.calcificationsSuspectes || null,
      distributionMicrocalcifications: formOneData.distributionMicrocalcifications || null,

      // Signes associés mammo — listes parallèles
      signesAssociesMammographie:       formOneData.signesAssociesMammographie || null,
      localisationsSignesMammographie:  formOneData.localisationsSignesMammographie || null,

      // ── Échographie ───────────────────────────────────────────────────────
      echostructureMammaire: echostructureMammaire || null,

      // Signes associés écho — listes parallèles séparées
      signesAssociesEchostructure:      signesAssocies.length > 0 ? signesAssocies : null,
      localisationsSignesEchostructure: signesAssocies.length > 0
        ? signesAssocies.map((s) => signesLocalisations[s] || "") : null,

      // Cas spéciaux
      casSpeciaux: casSpeciaux.map((name) => ({
        nom: name,
        localisation: casSpeciauxLocalisations[name] || "",
      })),

      conclusionRadiologue: null,
      conduiteRadiologue:   null,
      conclusionIA:         null,
      conduiteATenir:       null,
      client: { id: clientId || null },

      massesMammographie:  formOneData.massesMammographie?.length ? formOneData.massesMammographie : null,
      massesEchostructure: massesEchographie,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/mammary-scan/add`, scanData);
      const scanId = response.data.id;
      toast.success("Scan enregistré avec succès ✅");
      await axios.get(`${API_BASE_URL}/api/mammary-scan/acr/${scanId}`);
      toast.success("Analyse IA lancée ✅");
      navigate("/formthree", { state: { scanId } });
    } catch (error) {
      toast.error("Erreur lors de la création du scan ou de l'analyse IA ❌");
      console.error(error);
    }
  };

  return {
    steps,
    nombreMasse,
    localisations,
    distancesCentre,
    seins,
    mesures,
    formes,
    contours,
    densites,
    orientations,
    comportements,
    calcifications,
    casSpeciaux,
    casSpeciauxLocalisations,
    signesAssocies,
    signesLocalisations,
    handleNextClick,
    echostructureMammaire,
    handleEchostructureChange,
    handleNombreMasseChange,
    handleLocalisationChange,
    handleDistanceCentreChange,
    handleSeinChange,
    handleMesureChange,
    handleMassesDataChange,
    handleSignesAssociesChange,
    handleSigneLocalisationChange,
    handleCasSpeciauxChange,
    handleCasSpeciauxLocalisationChange,
  };
};