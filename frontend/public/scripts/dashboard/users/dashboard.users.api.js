export const fetchDashboardUsers = async () => {
  const res = await fetch("/api/user");
  return await res.json();
};

export const createUser = async (data) => {
  const res = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`/api/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};
