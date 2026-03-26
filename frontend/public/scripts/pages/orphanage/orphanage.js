import { showToast } from "/scripts/toast.js";
import {
  getQueryParam,
  renderByType,
  setActiveButton,
} from "../opportunities/opportunities.utils.js";
import { fetchAndSumData } from "./orphanage.utils.js";
import {
  fetchCampaigns,
  fetchOrphans,
} from "../opportunities/opportunities.api.js";
import { createOrphanCard } from "../opportunities/orphan.card.js";
import { createCampaignCard } from "../opportunities/campaign.card.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Get elements
    const orphanageName = document.getElementById("orphanage-name");
    const orphanageLocation = document.getElementById("orphanage-location");
    const orphanageImage = document.getElementById("orphanage-image");

    const orphansCount = document.getElementById("orphans-count");
    const campaignsCount = document.getElementById("campaigns-count");

    const orphanageDescription = document.getElementById(
      "orphanage-description"
    );

    const orphanBtn = document.getElementById("orphan-btn");
    const campaignBtn = document.getElementById("campaign-btn");

    const cardsContainer = document.getElementById("cards-container");

    const contactInfo = document.getElementById("contact-info");

    // Get orphanage ID from query parameter
    const id = getQueryParam("id");

    // Fetch orphanage data
    const res = await fetch(`/api/orphanage/${id}`);
    const { success, data, message } = await res.json();
    showToast(message, success ? "success" : "error");

    const orphanage = data.orphanage;

    // Populate elements with orphanage data
    orphanageName.textContent = orphanage.name;
    orphanageLocation.textContent = `📍 ${orphanage.location.city}, ${orphanage.location.country}`;
    orphanageImage.src = orphanage.images?.[0] || orphanageImage.src;

    orphanageDescription.textContent = orphanage.description;

    contactInfo.textContent = `Phone: ${orphanage.contact.phone} · Email: ${orphanage.contact.email}`;

    const { counts } = await fetchAndSumData(id);
    orphansCount.textContent = counts.campaigns;
    campaignsCount.textContent = counts.orphans;

    orphanBtn.addEventListener("click", async () => {
      try {
        setActiveButton(orphanBtn, campaignBtn);
        const { success, data, message } = await fetchOrphans();
        showToast(message, success ? "success" : "error");
        cardsContainer.innerHTML = "";

        data.orphans.forEach((orphan) => {
          if (orphan.orphanageId === id) {
            const card = createOrphanCard(orphan);
            cardsContainer.appendChild(card);
          }
        });
      } catch (error) {
        throw error;
      }
    });

    campaignBtn.addEventListener("click", async () => {
      setActiveButton(campaignBtn, orphanBtn);
      try {
        const { success, data, message } = await fetchCampaigns();
        showToast(message, success ? "success" : "error");
        cardsContainer.innerHTML = "";

        data.campaigns.forEach((campaign) => {
          if (campaign.orphanageId === id) {
            console.log(campaign.orphanageId, id);
            const card = createCampaignCard(campaign);
            cardsContainer.appendChild(card);
          }
        });
      } catch (error) {
        throw error;
      }
    });

    const type = getQueryParam("type", "orphans");
    if (type) {
      renderByType(type);
    }
  } catch (error) {
    console.log(error);
    showToast(error.message, error.success ? "success" : "error");
  }
});
