import client from './client';

export const adminCreateEtudiant_37fc052773dec1eca97dbc3dcd5f5632 = async payload => {
  const { data } = await client.post('/admin/etudiants', payload);
  return data;
};

export const adminUpdateEtudiant_4d151a44819abf3afb1a1974bad4609e = async (etudiantId, payload) => {
  const { data } = await client.put(`/admin/etudiants/${etudiantId}`, payload);
  return data;
};

export const adminDeleteEtudiant_1d5f4c3f66e30726d68fe646c958369b = async etudiantId => {
  const { data } = await client.delete(`/admin/etudiants/${etudiantId}`);
  return data;
};

export const adminAffectationsEtudiant_f1e24967c13080d0651b0333d5b99026 = async (etudiantId, payload) => {
  const { data } = await client.put(`/admin/etudiants/${etudiantId}/affectations`, payload);
  return data;
};


export const adminCreateProfesseur_cf1e2c50cb63465e820288676b2ddcf8 = async payload => {
  const { data } = await client.post('/admin/professeurs', payload);
  return data;
};

export const adminUpdateProfesseur_1634138ac10fda83bf891647626ec898 = async (professeurId, payload) => {
  const { data } = await client.put(`/admin/professeurs/${professeurId}`, payload);
  return data;
};

export const adminDeleteProfesseur_ec02677e5ec717ba072a6bce027fa0e9 = async professeurId => {
  const { data } = await client.delete(`/admin/professeurs/${professeurId}`);
  return data;
};

export const adminListJuries_742f25f4fe4d930e29cc345de477347e = async () => {
  const { data } = await client.get('/admin/juries');
  return data;
};

export const adminCreateJury_a82970fa5418f991fc2b0e697cf4cdf6 = async payload => {
  const { data } = await client.post('/admin/juries', payload);
  return data;
};

export const adminShowJury_4ee0db45f0de80ffeef22398fb654d7e = async juryId => {
  const { data } = await client.get(`/admin/juries/${juryId}`);
  return data;
};

export const adminUpdateJury_6eade27ab0d6a937d07b83fb5d86ef63 = async (juryId, payload) => {
  const { data } = await client.put(`/admin/juries/${juryId}`, payload);
  return data;
};

export const adminDeleteJury_ba624e52e82d529369f939cb85fce50e = async juryId => {
  const { data } = await client.delete(`/admin/juries/${juryId}`);
  return data;
};

export const adminListSoutenances_633dad0d19aa2bae61af959c5f87364b = async (params = {}) => {
  const { data } = await client.get('/admin/soutenances', { params });
  return data;
};

export const adminPlanifierSoutenance_f1c43100c52b779df850cb757bb56d18 = async payload => {
  const { data } = await client.post('/admin/soutenances', payload);
  return data;
};

export const adminShowSoutenance_cdadd25a293941cc8fb36684d246bc47 = async soutenanceId => {
  const { data } = await client.get(`/admin/soutenances/${soutenanceId}`);
  return data;
};

export const adminUpdateSoutenance_a0694f3f508d04e1fdc8cb136de39928 = async (soutenanceId, payload) => {
  const { data } = await client.put(`/admin/soutenances/${soutenanceId}`, payload);
  return data;
};

export const adminDeleteSoutenance_8ed5d102440291b1ea86f177230df544 = async soutenanceId => {
  const { data } = await client.delete(`/admin/soutenances/${soutenanceId}`);
  return data;
};

export const adminUpdateNote_95d4e3e32e14bd6e61c1c59f91b90529 = async (soutenanceId, note_finale) => {
  const { data } = await client.put(`/admin/soutenances/${soutenanceId}/note`, { note_finale });
  return data;
};

export const adminAnnulerSoutenance_1837fbfec45cfab7e8bf132e4aab741b = async soutenanceId => {
  const { data } = await client.put(`/admin/soutenances/${soutenanceId}/annuler`);
  return data;
};

export const listRapportsByEtudiant_2d4c92b838a7c9aac0b5fab03389d10a = async (etudiantId) => {
  const { data } = await client.get(`/etudiants/${etudiantId}/rapports`);
  return data;
};
