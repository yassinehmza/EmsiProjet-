import client from './client';

/**
 * API Professeur
 * Endpoints pour les professeurs (rapports, soutenances, remarques)
 */

// Récupérer les rapports assignés au professeur
export const getProfesseurRapports = async (professeurId) => {
  const { data } = await client.get(`/professeurs/${professeurId}/rapports`);
  return data.rapports || [];
};

// Récupérer les soutenances où le professeur est membre du jury
export const getProfesseurSoutenances = async (professeurId) => {
  const { data } = await client.get(`/professeurs/${professeurId}/soutenances`);
  return data.soutenances || [];
};

// Ajouter une remarque sur un rapport
export const addRemarque = async (rapportId, payload) => {
  const { data } = await client.post(`/rapports/${rapportId}/remarques`, payload);
  return data;
};

// Récupérer les remarques d'un rapport
export const getRapportRemarques = async (rapportId) => {
  const { data } = await client.get(`/rapports/${rapportId}/remarques`);
  return data.remarques || [];
};

// Récupérer la liste des étudiants encadrés/rapportés
export const getProfesseurEtudiants = async (professeurId) => {
  try {
    const { data } = await client.get(`/professeurs/${professeurId}/etudiants`);
    return data.etudiants || [];
  } catch (error) {
    console.error('Erreur getProfesseurEtudiants:', error);
    return [];
  }
};
