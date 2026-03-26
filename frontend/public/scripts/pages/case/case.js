import {
  renderCampaignDonationCard,
  renderCampaignProgress,
  renderOrphanageCard,
  renderOrphanDonationCard,
} from "./case.ui.components.js";
import { fetchCase, fetchOrphanage } from "./case.api.js";
import { getQueryParam } from "../opportunities/opportunities.utils.js";
import { showToast } from "/scripts/toast.js";
import { createOrphanDonationInput } from "../orphan.donation.input.js";
import { addItemToCart } from "../opportunities/opportunities.api.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const id = getQueryParam("id");
    const type = getQueryParam("type");
    const isOrphan = type === "orphan";

    const {
      data: caseData,
      success: caseSuccess,
      message: caseMessage,
    } = await fetchCase(type, id);
    showToast(caseMessage, caseSuccess ? "success" : "error");

    document.getElementById("donation-component").innerHTML = isOrphan
      ? renderOrphanDonationCard(caseData.orphan)
      : renderCampaignDonationCard();
    document.getElementById("case-heading").innerText = renderCaseHeading(
      isOrphan,
      caseData
    );
    document.getElementById("case-path-name").innerText = renderCaseHeading(
      isOrphan,
      caseData
    );
    document.getElementById("case-city").innerText = renderCaseCity(caseData);
    document.getElementById("case-description").innerText =
      renderCaseDescription(isOrphan, caseData);
    document
      .getElementById("case-image")
      .setAttribute("src", renderCaseImage(isOrphan, caseData));

    // --- Render Info about the campaign ---
    if (!isOrphan) {
      document.getElementById("case-dates").innerText = renderCaseDates(
        caseData.campaign
      );
      document.getElementById("case-beneficiaries").innerText =
        renderCaseBeneficiaries(caseData.campaign);
      document.getElementById("case-progress").innerHTML =
        renderCampaignProgress(caseData.campaign);
    }

    // --- Donation Box Functionality ---
    let getAmount;
    const donationBox = document.getElementById("donation-component");
    if (!isOrphan) {
      // Campaign: preset buttons and input
      const presetBtns = donationBox.querySelectorAll("button");
      const customInput = donationBox.querySelector('input[type="number"]');
      let selectedAmount = 30;
      presetBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          presetBtns.forEach((b) =>
            b.classList.remove("bg-green-100", "text-green-700")
          );
          btn.classList.add("bg-green-100", "text-green-700");
          selectedAmount = parseInt(btn.textContent) || 1;
          customInput.value = selectedAmount;
        });
      });
      customInput.addEventListener("input", () => {
        let val = parseInt(customInput.value) || 1;
        selectedAmount = val;
        presetBtns.forEach((b) =>
          b.classList.remove("bg-green-100", "text-green-700")
        );
      });
      getAmount = () => parseInt(customInput.value) || selectedAmount || 1;
    } else {
      // Mount the reusable orphan donation input
      const orphanInput = createOrphanDonationInput({
        unitPrice: 100,
        initialAmount: 1,
      });
      document
        .getElementById("orphan-donation-input")
        .appendChild(orphanInput.element);
      // Use orphanInput.getAmount for donation
      getAmount = orphanInput.getTotal;
    }

    // --- Add to Cart Button ---
    const cartBtn = document.getElementById("cart-btn");
    let recipientId = isOrphan ? caseData.orphan._id : caseData.campaign._id;
    let donationType = isOrphan ? "orphan" : "campaign";
    let donationTypeRef = isOrphan ? "Orphan" : "Campaign";
    cartBtn.addEventListener("click", async () => {
      const amount = getAmount();
      if (!amount || amount < 1)
        return showToast("Enter a valid amount", "error");
      try {
        const data = await addItemToCart({
          donationType,
          recipientId,
          donationTypeRef,
          amount,
        });
        if (data.success) {
          showToast("Added to cart!", "success");
        } else {
          showToast(data.message, "error");
        }
      } catch (err) {
        showToast(err.message || "Failed to add to cart", "error");
      }
    });

    // --- Orphanage Info ---
    const {
      data: orphanageData,
      success: orphanageSuccess,
      message: orphanageMessage,
    } = await fetchOrphanage(
      caseData.orphan?.orphanageId ?? caseData.campaign?.orphanageId
    );

    document.getElementById("association-info").innerHTML = renderOrphanageCard(
      orphanageData?.orphanage
    );

    showToast(orphanageMessage, orphanageSuccess ? "success" : "error");
  } catch (error) {
    console.log(error);
    showToast(error.message, error.success ? "success" : "error");
  }
});

// Formats a date string to a readable format.
function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Renders the case heading based on type.
function renderCaseHeading(isOrphan, data) {
  return isOrphan ? data.orphan.name.split(" ")[0] : data.campaign.title;
}

// Renders the city/location for the case.
function renderCaseCity(data) {
  return `📍 ${data.orphan?.location.city ?? data.campaign?.location.city}`;
}

// Renders the case dates for campaigns.
function renderCaseDates(campaign) {
  return `📅 ${formatDate(campaign.startDate)} / ${formatDate(
    campaign.endDate
  )}`;
}

// Renders the beneficiaries for campaigns.
function renderCaseBeneficiaries(campaign) {
  return `👥 Beneficiaries: ${campaign.Beneficiaries}`;
}

// Renders the case description.
function renderCaseDescription(isOrphan, data) {
  return isOrphan ? data.orphan.bio : data.campaign.description;
}

// Renders the case description.
function renderCaseImage(isOrphan, data) {
  return isOrphan ? data.orphan.photos[0] : data.campaign.images[0];
}
