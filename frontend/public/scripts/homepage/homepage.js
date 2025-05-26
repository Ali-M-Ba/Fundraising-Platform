import { createCampaignCard } from "../opportunities/campaign.card.js";
import { fetchAndSumData } from "./homepage.utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const CardsContainer = document.getElementById("cards-container");

  try {
    try {
      const { totalCount, orphans, campaigns, counts } =
        await fetchAndSumData();

      document.getElementById("current-opportunities").innerText = totalCount;
      document.getElementById("completed-opportunities").innerText =
        counts.completedCampaigns;
      document.getElementById("transactions").innerText = counts.donations;

      CardsContainer.innerHTML = "";
      campaigns.active.slice(0, 3).forEach((campaign) => {
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

