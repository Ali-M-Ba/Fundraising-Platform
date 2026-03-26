export const fetchDashboardCampaigns = async () => {
  const res = await fetch("/api/campaign");
  return await res.json();
};

export const fetchDashboardCampaign = async (id) => {
  const res = await fetch(`/api/campaign/${id}`);
  return await res.json();
};

export const createCampaign = async (data) => {
  const res = await fetch("/api/campaign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const updateCampaign = async (id, data) => {
  const res = await fetch(`/api/campaign/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const deleteCampaign = async (id) => {
  const res = await fetch(`/api/campaign/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};
