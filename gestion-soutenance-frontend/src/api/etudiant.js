import client from './client';

/**
 * API Étudiant
 * Endpoints pour les étudiants (rapports, soutenance, remarques)
 */

// Récupérer les rapports de l'étudiant
export const getEtudiantRapports = async (etudiantId) => {
  const { data } = await client.get(`/etudiants/${etudiantId}/rapports`);
  return data;
};

// Déposer un nouveau rapport
export const deposerRapport = async (etudiantId, payload) => {
  const { data } = await client.post(`/etudiants/${etudiantId}/rapports`, payload);
  return data;
};

// Récupérer les détails de la soutenance de l'étudiant
export const getEtudiantSoutenance = async (etudiantId) => {
  const { data } = await client.get(`/etudiants/${etudiantId}/soutenance`);
  return data;
};

// Récupérer les remarques sur un rapport spécifique
export const getRapportRemarques = async (rapportId) => {
  const { data } = await client.get(`/rapports/${rapportId}/remarques`);
  return data;
};
