// Fetches a case (orphan or campaign) by type and ID.
export const fetchCase = async (type, id) => {
  const res = await fetch(`/api/${type}/${id}`);
  return await res.json();
};

// Fetches an orphanage by ID.
export const fetchOrphanage = async (id) => {
  const res = await fetch(`/api/orphanage/${id}`);
  return await res.json();
};
