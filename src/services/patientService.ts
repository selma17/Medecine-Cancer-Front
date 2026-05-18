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
    const clientsResponse = await axios.get<ClientResponse[]>(
      `${API_BASE_URL}/clients/by-medecin`
    );
    const clients = clientsResponse.data;
    if (!clients || clients.length === 0) return [];

    const scansResponse = await axios.get<MammaryScanResponse[]>(
      `${API_BASE_URL}/mammary-scan/all`
    );
    const allScans = scansResponse.data;

    const clientIds = new Set(clients.map((c) => c.id));
    const myScans = allScans.filter(
      (scan) => scan.client && clientIds.has(scan.client.id)
    );

    // Clients avec scan
    const clientsWithScan = new Set(myScans.map(s => s.client.id));

    // Clients sans scan — affichés mais supprimables via clientId
    const clientsWithoutScan: Patient[] = clients
      .filter(c => !clientsWithScan.has(c.id))
      .map(client => ({
        id: `client-${client.id}`,
        nom: client.nom,
        prenom: client.prenom,
        acr: '-',
        type: '-',
        clientId: client.id,
        dateCreation: new Date().toISOString(),
      }));

    // Clients avec scan
    const patientsWithScan: Patient[] = myScans.map((scan) => ({
      id: `scan-${scan.id}`,
      nom: scan.client?.nom || 'N/A',
      prenom: scan.client?.prenom || 'N/A',
      acr: scan.acrScore || scan.conclusionIA || '-',
      type: scan.acrType || '-',
      scanId: scan.id,
      clientId: scan.client?.id,
      dateCreation: new Date().toISOString(),
    }));

    const all = [...patientsWithScan, ...clientsWithoutScan];
    return all.sort((a, b) => (b.scanId || 0) - (a.scanId || 0));
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};

export const getScanById = async (scanId: number): Promise<MammaryScanResponse> => {
  const response = await axios.get<MammaryScanResponse>(
    `${API_BASE_URL}/mammary-scan/${scanId}`
  );
  return response.data;
};

// Supprime le scan ET le client
export const deletePatient = async (scanId?: number, clientId?: number): Promise<void> => {
  if (scanId) {
    await axios.delete(`${API_BASE_URL}/mammary-scan/delete/${scanId}`);
  }
  if (clientId) {
    await axios.delete(`${API_BASE_URL}/clients/${clientId}`);
  }
};

// Garde deleteScan pour compatibilité
export const deleteScan = async (scanId: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/mammary-scan/delete/${scanId}`);
};

export const getScansByClientId = async (clientId: number): Promise<MammaryScanResponse[]> => {
  const allScans = await axios.get<MammaryScanResponse[]>(
    `${API_BASE_URL}/mammary-scan/all`
  );
  return allScans.data.filter(scan => scan.client.id === clientId);
};