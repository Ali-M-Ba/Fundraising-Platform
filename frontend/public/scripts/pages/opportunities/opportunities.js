import { showToast } from "/scripts/toast.js";
import { fetchCampaigns, fetchOrphans } from "./opportunities.api.js";
import { createCampaignCard } from "./campaign.card.js";
import { createOrphanCard } from "./orphan.card.js";
import {
  getQueryParam,
  renderByType,
  setActiveButton,
} from "./opportunities.utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const CardsContainer = document.getElementById("cards-container");
  const orphanBtn = document.getElementById("orphan-btn");
  const campaignBtn = document.getElementById("campaign-btn");

  try {
    const orphan = document.getElementById("orphan-btn");
    orphan.addEventListener("click", async () => {
      try {
        setActiveButton(orphanBtn, campaignBtn);
        const { success, data, message } = await fetchOrphans();
        showToast(message, success ? "success" : "error");

        CardsContainer.innerHTML = "";
        data.orphans.forEach((orphan) => {
          const card = createOrphanCard(orphan);
          CardsContainer.appendChild(card);
        });
      } catch (error) {
        throw error;
      }
    });

    const campaign = document.getElementById("campaign-btn");
    campaign.addEventListener("click", async () => {
      setActiveButton(campaignBtn, orphanBtn);
      try {
        const { success, data, message } = await fetchCampaigns();
        showToast(message, success ? "success" : "error");
        CardsContainer.innerHTML = "";

        data.campaigns.forEach((campaign) => {
          const card = createCampaignCard(campaign);
          CardsContainer.appendChild(card);
        });
      } catch (error) {
        throw error;
      }
    });

    const type = getQueryParam("type", "orphans");
    if (type) {
      renderByType(type);
    }
  } catch (err) {
    CardsContainer.innerHTML = `<p class="text-red-500">Failed to load data.</p>`;
    console.error(err);
  }
});
