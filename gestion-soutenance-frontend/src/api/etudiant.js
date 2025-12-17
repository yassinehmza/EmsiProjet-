import client from './client';

/**
 * API Étudiant
 * Endpoints pour les étudiants (rapports, soutenance, remarques)
 */

// Récupérer les rapports de l'étudiant
export const getEtudiantRapports = async (etudiantId) => {
  const { data } = await client.get(`/etudiants/${etudiantId}/rapports`);
  return data.rapports || []; // Backend retourne { rapports: [...] }
};

// Déposer un nouveau rapport
export const deposerRapport = async (etudiantId, payload) => {
  // Si payload est FormData (fichier), ne pas modifier les headers
  // Axios détecte automatiquement FormData et met 'Content-Type: multipart/form-data'
  const { data } = await client.post(`/etudiants/${etudiantId}/rapports`, payload);
  return data.rapport; // Backend retourne { rapport: {...} }
};

// Récupérer les détails de la soutenance de l'étudiant
export const getEtudiantSoutenance = async (etudiantId) => {
  const { data } = await client.get(`/etudiants/${etudiantId}/soutenance`);
  return data.soutenance || null; // Backend retourne { soutenance: {...} }
};

// Récupérer les remarques sur un rapport spécifique
export const getRapportRemarques = async (rapportId) => {
  const { data } = await client.get(`/rapports/${rapportId}/remarques`);
  return data.remarques || []; // Backend retourne { remarques: [...] }
};
