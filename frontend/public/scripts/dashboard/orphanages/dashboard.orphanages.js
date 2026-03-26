import {
  deleteOrphanage,
  fetchDashboardOrphanages,
} from "./dashboard.orphanages.api.js";
import { dashboardOrphanageCard } from "./dashboard.orphanages.card.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { success, data, message } = await fetchDashboardOrphanages();

  const container = document.querySelector("#orphanagesContainer");
  if (!container) return;

  // normalize list
  const orphanages = Array.isArray(data)
    ? data
    : data && Array.isArray(data.orphanages)
      ? data.orphanages
      : [];

  if (!success || orphanages.length === 0) {
    container.innerHTML = `<div class="px-6 py-8 rounded-xl border text-center text-gray-600">${
      success ? "No orphanages found." : message || "Failed to load orphanages."
    }</div>`;
    return;
  }

  // render list
  container.innerHTML = orphanages
    .map((o, idx) => dashboardOrphanageCard(o, idx))
    .join("\n");

  // basic delete button handler placeholder (no server call yet)
  container.querySelectorAll(".delete-orphanage").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      const { success, message } = await deleteOrphanage(id);
      // future: confirm and call DELETE `/api/orphanage/:id`
      console.log("delete orphanage", id, success, message);
    });
  });
});
