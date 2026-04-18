import axios from 'axios';
import { API_BASE_URL as BASE_URL } from '../config';

const API_BASE_URL = `${BASE_URL}/api`;

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  acr: string;
  type: string;
  scanId?: number;
  clientId?: number;
  dateCreation?: string;
}

export interface MammaryScanResponse {
  id: number;
  acrScore: string | null;
  acrType: string | null;
  client: {
    id: number;
    nom: string;
    prenom: string;
    renseignementsCliniques?: string;
    medecin?: { id: number };
  };
  conclusionIA?: string;
  conduiteATenir?: string;
}

export interface ClientResponse {
  id: number;
  nom: string;
  prenom: string;
  renseignementsCliniques?: string;
}

// Récupère les patients du médecin connecté
export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const medecinId = user?.id;

    if (!medecinId) return [];

    // Récupérer les clients du médecin
    const clientsResponse = await axios.get<ClientResponse[]>(
      `${BASE_URL}/api/clients/by-medecin`
    );
    const clients = clientsResponse.data;

    if (!clients || clients.length === 0) return [];

    // Pour chaque client, récupérer ses scans
    const allScans = await axios.get<MammaryScanResponse[]>(
      `${BASE_URL}/api/mammary-scan/all`
    );

    // Filtrer les scans appartenant aux clients du médecin
    const clientIds = new Set(clients.map(c => c.id));
    const filteredScans = allScans.data.filter(
      scan => scan.client && clientIds.has(scan.client.id)
    );

    const patients: Patient[] = filteredScans.map((scan) => ({
      id: `scan-${scan.id}`,
      nom: scan.client?.nom || 'N/A',
      prenom: scan.client?.prenom || 'N/A',
      acr: scan.acrScore || '-',
      type: scan.acrType || '-',
      scanId: scan.id,
      clientId: scan.client?.id,
      dateCreation: new Date().toISOString(),
    }));

    return patients.sort((a, b) => (b.scanId || 0) - (a.scanId || 0));
  } catch (error) {
    console.error('Erreur lors de la récupération des patients:', error);
    throw error;
  }
};

export const getScanById = async (scanId: number): Promise<MammaryScanResponse> => {
  const response = await axios.get<MammaryScanResponse>(
    `${API_BASE_URL}/mammary-scan/${scanId}`
  );
  return response.data;
};

export const deleteScan = async (scanId: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/mammary-scan/delete/${scanId}`);
};

export const getScansByClientId = async (clientId: number): Promise<MammaryScanResponse[]> => {
  const allScans = await axios.get<MammaryScanResponse[]>(
    `${API_BASE_URL}/mammary-scan/all`
  );
  return allScans.data.filter(scan => scan.client.id === clientId);
};