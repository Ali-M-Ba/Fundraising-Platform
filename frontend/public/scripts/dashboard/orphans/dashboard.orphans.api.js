export const fetchDashboardOrphans = async () => {
  const res = await fetch("/api/orphan");
  return await res.json();
};

export const fetchDashboardOrphan = async (id) => {
  const res = await fetch(`/api/orphan/${id}`);
  return await res.json();
};

export const createOrphan = async (data) => {
  const res = await fetch("/api/orphan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const updateOrphan = async (id, data) => {
  const res = await fetch(`/api/orphan/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const deleteOrphan = async (id) => {
  const res = await fetch(`/api/orphan/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};
