import { useState } from "react";
import { useScanStore } from "../../src/store/useScanStore";
import { toast } from "sonner";

export const useFormOneLogic = (navigate: (path: string) => void) => {
  const { setFormOneData } = useScanStore();

  const [selected, setSelected] = useState<string[]>([]);
  const [massNumber, setMassNumber] = useState<string>("");
  const [localisations, setLocalisations] = useState<string[]>([]);
  const [seins, setSeins] = useState<("gauche" | "droit")[]>([]);
  const [asymmetry, setAsymmetry] = useState<string>("");
  const [asymmetryDetails, setAsymmetryDetails] = useState<string[]>([]);
  const [asymmetryLocalisation, setAsymmetryLocalisation] = useState<string>("");
  const [distortion, setDistortion] = useState<string>("");
  const [distortionOption, setDistortionOption] = useState<string>("");
  const [distortionLocalisation, setDistortionLocalisation] = useState<string>("");
  const [calcifications, setCalcifications] = useState<string>("");
  const [calcificationLocalisation, setCalcificationLocalisation] = useState<string>("");
  const [signsAssociated, setSignsAssociated] = useState<string[]>([]);
  const [signsLocalisations, setSignsLocalisations] = useState<{ [key: string]: string }>({});
  const [hoveredOption, setHoveredOption] = useState<string>("");
  const [showDistortionOptions, setShowDistortionOptions] = useState<boolean>(false);
  const [typeCalcification, setTypeCalcification] = useState<string>("");
  const [benigneSelected, setBenigneSelected] = useState<string[]>([]);
  const [suspecteSelected, setSuspecteSelected] = useState<string[]>([]);
  const [hoveredCalcificationOption, setHoveredCalcificationOption] = useState<string>("");
  const [distributionMicrocalcifications, setDistributionMicrocalcifications] = useState<string[]>([]);
  const [formes, setFormes] = useState<string[]>([]);
  const [contours, setContours] = useState<string[]>([]);
  const [densites, setDensites] = useState<string[]>([]);

  const handleCheckboxChange = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleLocalisationChange = (index: number, value: string) => {
    setLocalisations((prev) => { const u = [...prev]; u[index] = value; return u; });
  };

  const handleSeinChange = (index: number, value: "gauche" | "droit") => {
    setSeins((prev) => { const u = [...prev]; u[index] = value; return u; });
  };

  const handleAsymmetryChange = (value: string) => {
    setAsymmetry(value);
    if (value === "non") { setAsymmetryDetails([]); setAsymmetryLocalisation(""); }
  };

  const handleAsymmetryDetailsChange = (value: string) => {
    setAsymmetryDetails((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleAsymmetryLocalisationChange = (value: string) => setAsymmetryLocalisation(value);

  const handleDistortionChange = (value: string) => {
    setDistortion(value);
    setShowDistortionOptions(value === "oui");
    if (value === "non") { setDistortionOption(""); setDistortionLocalisation(""); }
  };

  const handleDistortionOptionChange = (value: string) => setDistortionOption(value);
  const handleDistortionLocalisationChange = (value: string) => setDistortionLocalisation(value);

  const handleCalcificationsChange = (value: string) => {
    setCalcifications(value);
    if (value === "non") {
      setTypeCalcification(""); setBenigneSelected([]); setSuspecteSelected([]);
      setCalcificationLocalisation("");
    }
  };

  const handleCalcificationLocalisationChange = (value: string) => setCalcificationLocalisation(value);

  const handleTypeCalcificationChange = (value: string) => {
    setTypeCalcification(typeCalcification === value ? "" : value);
  };

  const handleBenigneCheckboxChange = (value: string) => {
    setBenigneSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSuspecteCheckboxChange = (value: string) => {
    setSuspecteSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleCalcificationLeave = () => setHoveredCalcificationOption("");

  const handleSignsAssociatedChange = (value: string) => {
    setSignsAssociated((prev) => {
      if (prev.includes(value)) {
        const updated = prev.filter((item) => item !== value);
        setSignsLocalisations((loc) => { const u = { ...loc }; delete u[value]; return u; });
        return updated;
      }
      return [...prev, value];
    });
  };

  const handleSignLocalisationChange = (sign: string, value: string) => {
    setSignsLocalisations((prev) => ({ ...prev, [sign]: value }));
  };

  const handleDistributionChange = (option: string) => {
    setDistributionMicrocalcifications((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleMassNumberChange = (value: string) => {
    setMassNumber(value);
    const numberOfMasses = Number(value);
    setLocalisations(new Array(numberOfMasses).fill(""));
    setSeins(new Array(numberOfMasses).fill("gauche"));
    setFormes(new Array(numberOfMasses).fill(""));
    setContours(new Array(numberOfMasses).fill(""));
    setDensites(new Array(numberOfMasses).fill(""));
  };

  const handleMassesDataChange = (index: number, type: "forme" | "contour" | "densite", value: string) => {
    if (type === "forme") setFormes((prev) => { const u = [...prev]; u[index] = value; return u; });
    else if (type === "contour") setContours((prev) => { const u = [...prev]; u[index] = value; return u; });
    else if (type === "densite") setDensites((prev) => { const u = [...prev]; u[index] = value; return u; });
  };

  const steps = [
    { title: "Mammographie", status: "en cours" as const },
    { title: "Échographie", status: "en attente" as const },
    { title: "Conclusion", status: "en attente" as const },
  ];

  const handleNextClick = () => {
    // ── Validation ──────────────────────────────────────────────────────────
    if (selected.length === 0) {
      toast.error("⚠️ Veuillez sélectionner la densité mammaire");
      return;
    }
    // Masses optionnelles — mais si présentes, tous les champs requis
    const nbMasses = Number(massNumber) || 0;
    for (let i = 0; i < nbMasses; i++) {
      if (!localisations[i]) { toast.error(`⚠️ Masse ${i+1} : localisation manquante`); return; }
      if (!formes[i])        { toast.error(`⚠️ Masse ${i+1} : forme manquante`); return; }
      if (!contours[i])      { toast.error(`⚠️ Masse ${i+1} : contours manquants`); return; }
      if (!densites[i])      { toast.error(`⚠️ Masse ${i+1} : densité manquante`); return; }
    }
    if (!asymmetry) {
      toast.error("⚠️ Veuillez indiquer si une asymétrie est présente (Oui/Non)");
      return;
    }
    if (!distortion) {
      toast.error("⚠️ Veuillez indiquer si une distorsion architecturale est présente (Oui/Non)");
      return;
    }
    if (!calcifications) {
      toast.error("⚠️ Veuillez indiquer si des calcifications sont présentes (Oui/Non)");
      return;
    }
    if (calcifications === "oui" && !typeCalcification) {
      toast.error("⚠️ Veuillez sélectionner le type de calcifications (bénigne/suspecte)");
      return;
    }
    const massesMammographie = localisations.map((localisation, index) => ({
      localisation,
      sein: seins[index] || "gauche",
      forme: formes[index] || "",
      contours: contours[index] || "",
      densite: densites[index] || "",
    }));

    setFormOneData({
      densiteMammaire: selected.length > 0 ? selected.join(", ") : null,
      massesMammographie: massesMammographie.length > 0 ? massesMammographie : null,

      // Asymétrie — champs séparés
      asymetrie: asymmetry === "oui" ? true : null,
      typeAsymetrie: asymmetry === "oui" && asymmetryDetails.length > 0
        ? asymmetryDetails.join(", ") : null,
      localisationAsymetrie: asymmetry === "oui" && asymmetryLocalisation
        ? asymmetryLocalisation : null,

      // Distorsion — champs séparés
      distorsionArchitecturale: distortion === "oui" ? true : null,
      optionDistorsionArchitecturale: distortion === "oui" && distortionOption
        ? distortionOption : null,
      localisationDistorsion: distortion === "oui" && distortionLocalisation
        ? distortionLocalisation : null,

      // Calcifications — champs séparés
      calcifications: calcifications === "oui" ? true : null,
      typesCalcifications: typeCalcification || null,
      localisationCalcifications: calcificationLocalisation || null,
      calcificationsBenignes: benigneSelected.length > 0 ? benigneSelected.join(", ") : null,
      calcificationsSuspectes: suspecteSelected.length > 0 ? suspecteSelected.join(", ") : null,
      distributionMicrocalcifications: distributionMicrocalcifications.length > 0
        ? distributionMicrocalcifications.join(", ") : null,

      // Signes associés — listes parallèles séparées
      signesAssociesMammographie: signsAssociated.length > 0 ? signsAssociated : null,
      localisationsSignesMammographie: signsAssociated.length > 0
        ? signsAssociated.map((s) => signsLocalisations[s] || "") : null,
    });

    navigate("/formtwo");
  };

  return {
    massNumber,
    setMassNumber: handleMassNumberChange,
    localisations,
    seins,
    handleLocalisationChange,
    handleSeinChange,
    formes, setFormes,
    contours, setContours,
    densites, setDensites,
    handleMassesDataChange,
    handleNextClick,
    steps,
    selected,
    asymmetry, asymmetryDetails, asymmetryLocalisation,
    handleAsymmetryChange, handleAsymmetryDetailsChange, handleAsymmetryLocalisationChange,
    distortion, distortionOption, distortionLocalisation,
    handleDistortionChange, handleDistortionOptionChange, handleDistortionLocalisationChange,
    showDistortionOptions,
    calcifications, calcificationLocalisation,
    handleCalcificationsChange, handleCalcificationLocalisationChange,
    typeCalcification, handleTypeCalcificationChange,
    benigneSelected, handleBenigneCheckboxChange,
    suspecteSelected, handleSuspecteCheckboxChange,
    hoveredOption, setHoveredOption,
    hoveredCalcificationOption, setHoveredCalcificationOption,
    handleCalcificationLeave,
    signsAssociated, signsLocalisations,
    handleSignsAssociatedChange, handleSignLocalisationChange,
    distributionMicrocalcifications, handleDistributionChange,
    handleCheckboxChange,
  };
};