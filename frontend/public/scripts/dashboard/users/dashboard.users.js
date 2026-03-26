import { fetchDashboardUsers, deleteUser } from "./dashboard.users.api.js";
import { dashboardUserCard } from "./dashboard.users.card.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { success, data, message } = await fetchDashboardUsers();

  const container = document.querySelector("#usersContainer");
  if (!container) return;

  const users = data?.users ?? [];

  if (!success || users.length === 0) {
    container.innerHTML = `<div class="px-6 py-8 rounded-xl border text-center text-gray-600">${
      success ? "No users found." : message || "Failed to load users."
    }</div>`;
    return;
  }

  container.innerHTML = users
    .map((u, idx) => dashboardUserCard(u, idx))
    .join("\n");

  container.querySelectorAll(".delete-user").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      if (!id) return;

      const confirmed = window.confirm(
        "Are you sure you want to delete this user?",
      );
      if (!confirmed) return;

      const { success, message } = await deleteUser(id);
      if (success) {
        e.currentTarget.closest("[data-user-id]").remove();
      } else {
        alert(message || "Failed to delete user.");
      }
    });
  });
});
