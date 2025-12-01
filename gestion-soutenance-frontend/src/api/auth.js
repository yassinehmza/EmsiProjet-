import client from './client';

export const loginEtudiant = async (email, password) => {
  const { data } = await client.post('/auth/etudiant/login', { email, password });
  return data;
};

export const loginProfesseur = async (email, password) => {
  const { data } = await client.post('/auth/professeur/login', { email, password });
  return data;
};

export const loginAdmin = async (email, password) => {
  const { data } = await client.post('/auth/admin/login', { email, password });
  return data;
};

export const loginAdmin_574417459337e78a0e6bec1a1dfe23a6 = async (email, password) => {
  const { data } = await client.post('/auth/admin/login', { email, password });
  return data;
};
