import { createOrphanDonationInput } from "../orphan.donation.input.js";

// Utility: Renders a donation amount button
function renderAmountButton(amount) {
  return `<button class="px-4 py-2 bg-gray-100 text-gray-700
  rounded">${amount} USD</button>`;
}

// Renders the donation card for a campaign case.
export const renderCampaignDonationCard = () => {
  return `
    <h4 class="text-lg font-semibold text-gray-800 mb-3">Choose Donation Amount</h4>
    <div class="flex flex-wrap gap-2 mb-4">
      ${renderAmountButton(30)}
      ${renderAmountButton(100)}
      ${renderAmountButton(150)}
      ${renderAmountButton(300)}
    </div>
    <div class="flex mb-3">
    <input type="number" value="30" class="w-full border rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-green-300" />
    <span class="inline-flex items-center px-3 border-t border-b border-r border-gray-300 bg-gray-100 rounded-r-md text-sm">
    USD
    </span>
    </div>
    `;
};

export const renderOrphanDonationCard = (orphan) => {
  return `
    <div class="max-w-xl mx-auto mb-6 p-4 bg-white rounded-lg shadow grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
      ${renderInfoItem("🧒", `${orphan.age} Years`)}
      ${renderInfoItem("👤", "Student")}
      ${renderInfoItem("🚻", orphan.gender)}
      ${renderInfoItem("❤️‍🩹", orphan.healthStatus)}
    </div>
    <div id="orphan-donation-input"></div>
  `;
};

// Renders the progress bar for a campaign.
export const renderCampaignProgress = (campaign) => {
  const percentage = Math.round(
    (campaign.amountRaised / campaign.targetAmount) * 100
  );
  return `        
    <div class="mb-4">
      <div class="text-sm text-gray-700 mb-1">${percentage}% | ${campaign.amountRaised} / ${campaign.targetAmount} USD</div>
      <div class="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
        <div class="bg-green-500 h-3" style="width: ${percentage}%"></div>
      </div>
    </div>`;
};

// Utility: Renders a labeled icon-value pair
function renderInfoItem(icon, value) {
  return `
    <div class="flex flex-col items-center space-y-1">
      ${icon}
      <span class="text-gray-800 font-medium">${value}</span>
    </div>
  `;
}

export const renderOrphanageCard = (orphanage) => {
  return `
  <h3 id="association-heading" class="font-semibold text-gray-800 mb-2">About The Association</h3>
  <div class="flex items-center space-x-4" aria-label="Association Info">
    <img src="https://media.istockphoto.com/id/1353985400/vector/home-care-vector-logo-design-property-care-home-and-real-estate-logo-template.jpg?s=612x612&w=0&k=20&c=TedbLGPcKiclea3PP0dPFYL6ge3eE6tDjol9i8QT1VE=" alt="Association Logo" class="w-12 h-12 rounded-full" />
    <div>
      <p class="font-medium text-gray-800">${orphanage?.name || "Unknown"}</p>
      <p class="text-sm text-gray-600">${
        orphanage?.description || "Unknown"
      }</p>
    </div>
  </div>
  `;
};
