export const fetchDashboardOrphanages = async () => {
  const res = await fetch("/api/orphanage");
  return await res.json();
};

export const fetchDashboardOrphanage = async (id) => {
  const res = await fetch(`/api/orphanage/${id}`);
  return await res.json();
};

export const createOrphanage = async (data) => {
  const res = await fetch("/api/orphanage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const updateOrphanage = async (id, data) => {
  const res = await fetch(`/api/orphanage/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const deleteOrphanage = async (id) => {
  const res = await fetch(`/api/orphanage/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};
