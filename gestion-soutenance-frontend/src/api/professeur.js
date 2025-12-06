import client from './client';

/**
 * API Professeur
 * Endpoints pour les professeurs (rapports, soutenances, remarques)
 */

// Récupérer les rapports assignés au professeur
export const getProfesseurRapports = async (professeurId) => {
  const { data } = await client.get(`/professeurs/${professeurId}/rapports`);
  return data;
};

// Récupérer les soutenances où le professeur est membre du jury
export const getProfesseurSoutenances = async (professeurId) => {
  const { data } = await client.get(`/professeurs/${professeurId}/soutenances`);
  return data;
};

// Ajouter une remarque sur un rapport
export const addRemarque = async (rapportId, payload) => {
  const { data } = await client.post(`/rapports/${rapportId}/remarques`, payload);
  return data;
};

// Récupérer les remarques d'un rapport
export const getRapportRemarques = async (rapportId) => {
  const { data } = await client.get(`/rapports/${rapportId}/remarques`);
  return data;
};

// Récupérer la liste des étudiants encadrés/rapportés
// Note: Extrait depuis les rapports du professeur
export const getProfesseurEtudiants = async (professeurId) => {
  try {
    const rapports = await getProfesseurRapports(professeurId);
    const etudiantsMap = new Map();
    
    if (Array.isArray(rapports)) {
      rapports.forEach(rapport => {
        if (rapport.etudiant && rapport.etudiant.id) {
          etudiantsMap.set(rapport.etudiant.id, rapport.etudiant);
        }
      });
    }
    
    return Array.from(etudiantsMap.values());
  } catch (error) {
    console.error('Erreur getProfesseurEtudiants:', error);
    return [];
  }
};
