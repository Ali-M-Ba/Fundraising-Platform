import {
  fetchDashboardOrphans,
  deleteOrphan,
} from "./dashboard.orphans.api.js";
import { dashboardOrphanCard } from "./dashboard.orphans.card.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { success, data, message } = await fetchDashboardOrphans();

  const container = document.querySelector("#orphansContainer");
  if (!container) return;

  const orphans = data?.orphans ?? [];

  if (!success || orphans.length === 0) {
    container.innerHTML = `<div class="px-6 py-8 rounded-xl border text-center text-gray-600">${
      success ? "No orphans found." : message || "Failed to load orphans."
    }</div>`;
    return;
  }

  container.innerHTML = orphans
    .map((o, idx) => dashboardOrphanCard(o, idx))
    .join("\n");
    
  container.querySelectorAll(".delete-orphan").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      const { success, message } = await deleteOrphan(id);
      if (success) {
        e.currentTarget.closest("[data-orphan-id]").remove();
      } else {
        alert(message || "Failed to delete orphan.");
      }
    });
  });
});
