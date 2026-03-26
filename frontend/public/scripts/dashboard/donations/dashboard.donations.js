import { fetchDonations } from "./dashboard.donations.api.js";
import { dashboardDonationCard } from "./dashboard.donations.card.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { success, data, message } = await fetchDonations();

  const container = document.querySelector("#donationsContainer");
  if (!container) return;

  // normalize list
  const donations = Array.isArray(data)
    ? data
    : data && Array.isArray(data.donations)
      ? data.donations
      : [];

  if (!success || donations.length === 0) {
    container.innerHTML = `<div class="px-6 py-8 rounded-xl border text-center text-gray-600">${
      success ? "No donations found." : message || "Failed to load donations."
    }</div>`;
    return;
  }

  // render list
  console.log(donations);
  container.innerHTML = donations
    .map((o, idx) => dashboardDonationCard(o, idx))
    .join("\n");
});
