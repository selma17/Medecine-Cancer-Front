// src/form-four/useStepFourLogic.ts
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

export const useStepFourLogic = (navigate: ReturnType<typeof useNavigate>) => {
  const location = useLocation();
  const { scanId } = location.state || {};

  const [conclusionIA, setConclusionIA] = useState<string>("");
  const [conduiteATenir, setConduiteATenir] = useState<string>("");
  const [acrType, setAcrType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const steps = [
    { title: "Mammographie", status: "terminée" as const },
    { title: "Échographie", status: "terminée" as const },
    { title: "Conclusion", status: "terminée" as const },
    { title: "Conduite", status: "en cours" as const },
  ];

  useEffect(() => {
    if (scanId) {
      axios.get(`${API_BASE_URL}/api/mammary-scan/${scanId}`)
        .then((response) => {
          const scan = response.data;
          if (scan.conclusionIA) {
            setConclusionIA(scan.conclusionIA);
          }
          if (scan.conduiteATenir) {
            setConduiteATenir(scan.conduiteATenir);
          }
          if (scan.acrType) {
            setAcrType(scan.acrType);
          }
        })
        .catch((error) => {
          console.error("Erreur récupération scan:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [scanId]);

  const handleSubmit = () => {
    navigate("/finalisation");
  };

  return {
    steps,
    conclusionIA,
    conduiteATenir,
    acrType,
    loading,
    handleSubmit,
  };
};
