import {
  deleteCampaign,
  fetchDashboardCampaigns,
} from "./dashboard.campaigns.api.js";
import { dashboardCampaignCard } from "./dashboard.campaigns.card.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { success, data, message } = await fetchDashboardCampaigns();

  const container = document.querySelector("#campaignsContainer");
  if (!container) return;

  // normalize list
  const campaigns = Array.isArray(data)
    ? data
    : data && Array.isArray(data.campaigns)
      ? data.campaigns
      : [];

  if (!success || campaigns.length === 0) {
    container.innerHTML = `<div class="px-6 py-8 rounded-xl border text-center text-gray-600">${
      success ? "No campaigns found." : message || "Failed to load campaigns."
    }</div>`;
    return;
  }

  // render list
  container.innerHTML = campaigns
    .map((o, idx) => dashboardCampaignCard(o, idx))
    .join("\n");

  // basic delete button handler placeholder (no server call yet)
  container.querySelectorAll(".delete-campaign").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      const { success, message } = await deleteCampaign(id);
      // future: confirm and call DELETE `/api/campaign/:id`
      console.log("delete campaign", id, success, message);
    });
  });
});
