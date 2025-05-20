import { createCampaignCard } from "../opportunities/campaign.card.js";
import { showToast } from "../toast.js";
import { fetchCampaigns } from "../opportunities/api.opportunities.js";

document.addEventListener("DOMContentLoaded", async () => {
  const CardsContainer = document.getElementById("cards-container");

  try {
    try {
      const { success, data, message } = await fetchCampaigns();
      showToast(message, success ? "success" : "error");
      CardsContainer.innerHTML = "";

      data.campaigns.slice(0, 3).forEach((campaign) => {
        const card = createCampaignCard(campaign);
        CardsContainer.appendChild(card);
      });
    } catch (error) {
      throw error;
    }
  } catch (err) {
    CardsContainer.innerHTML = `<p class="text-red-500">Failed to load data.</p>`;
    console.error(err);
  }
});
