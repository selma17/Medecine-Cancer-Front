import { useState } from "react";
import { useScanStore } from "../../src/store/useScanStore";

export const useFormOneLogic = (navigate: (path: string) => void) => {
  const { setFormOneData } = useScanStore();

  const [selected, setSelected] = useState<string[]>([]);
  const [massNumber, setMassNumber] = useState<string>("");
  const [localisations, setLocalisations] = useState<string[]>([]);
  const [seins, setSeins] = useState<("gauche" | "droite")[]>([]);
  const [asymmetry, setAsymmetry] = useState<string>("");
  const [asymmetryDetails, setAsymmetryDetails] = useState<string[]>([]);
  const [distortion, setDistortion] = useState<string>("");
  const [distortionOption, setDistortionOption] = useState<string>("");  // ← sélection unique
  const [calcifications, setCalcifications] = useState<string>("");
  const [signsAssociated, setSignsAssociated] = useState<string[]>([]);
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
    setLocalisations((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSeinChange = (index: number, value: "gauche" | "droite") => {
    setSeins((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAsymmetryChange = (value: string) => {
    setAsymmetry(value);
    if (value === "non") setAsymmetryDetails([]);
  };

  const handleAsymmetryDetailsChange = (value: string) => {
    setAsymmetryDetails((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleDistortionChange = (value: string) => {
    setDistortion(value);
    setShowDistortionOptions(value === "oui");
    if (value === "non") setDistortionOption("");
  };

  // Sélection unique pour l'option de distorsion
  const handleDistortionOptionChange = (value: string) => {
    setDistortionOption(value);
  };

  const handleCalcificationsChange = (value: string) => {
    setCalcifications(value);
    if (value === "non") {
      setTypeCalcification("");
      setBenigneSelected([]);
      setSuspecteSelected([]);
    }
  };

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
    setSignsAssociated((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
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
    if (type === "forme") {
      setFormes((prev) => { const u = [...prev]; u[index] = value; return u; });
    } else if (type === "contour") {
      setContours((prev) => { const u = [...prev]; u[index] = value; return u; });
    } else if (type === "densite") {
      setDensites((prev) => { const u = [...prev]; u[index] = value; return u; });
    }
  };

  const steps = [
    { title: "Mammographie", status: "in-progress" as const },
    { title: "Échographie", status: "pending" as const },
    { title: "Conclusion", status: "pending" as const },
  ];

  const handleNextClick = () => {
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
      asymetrie: asymmetry === "oui" ? true : null,
      typeAsymetrie: asymmetry === "oui" ? asymmetryDetails.join(", ") : null,
      distorsionArchitecturale: distortion === "oui" ? true : null,
      optionDistorsionArchitecturale: distortion === "oui" ? distortionOption : null,
      calcifications: calcifications === "oui" ? true : null,
      typesCalcifications: typeCalcification || null,
      signesAssociesMammographie: signsAssociated.length > 0 ? signsAssociated : null,
      calcificationsBenignes: benigneSelected.length > 0 ? benigneSelected.join(", ") : null,
      calcificationsSuspectes: suspecteSelected.length > 0 ? suspecteSelected.join(", ") : null,
      distributionMicrocalcifications: distributionMicrocalcifications.length > 0 ? distributionMicrocalcifications.join(", ") : null,
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
    formes,
    setFormes,
    contours,
    setContours,
    densites,
    setDensites,
    handleMassesDataChange,
    handleNextClick,
    steps,
    selected,
    asymmetry,
    asymmetryDetails,
    handleAsymmetryChange,
    handleAsymmetryDetailsChange,
    distortion,
    handleDistortionChange,
    showDistortionOptions,
    distortionOption,
    handleDistortionOptionChange,
    calcifications,
    handleCalcificationsChange,
    typeCalcification,
    handleTypeCalcificationChange,
    benigneSelected,
    handleBenigneCheckboxChange,
    suspecteSelected,
    handleSuspecteCheckboxChange,
    hoveredOption,
    setHoveredOption,
    hoveredCalcificationOption,
    setHoveredCalcificationOption,
    handleCalcificationLeave,
    signsAssociated,
    handleSignsAssociatedChange,
    distributionMicrocalcifications,
    handleDistributionChange,
    handleCheckboxChange,
  };
};