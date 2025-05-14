import { addItemToCart } from "./api.opportunities.js";

export const createCampaignCard = (campaign) => {
  const card = document.createElement("div");
  card.className =
    "max-w-sm bg-white rounded-lg shadow-md overflow-hidden flex flex-col";

  const percentage = Math.round(
    (campaign.amountRaised / campaign.targetAmount) * 100
  );

  card.innerHTML = `
        <!-- Image -->
        <img class="w-full h-40 object-cover" src="${campaign.images[0]}" alt="${campaign.title}" />

        <!-- Title -->
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2">${campaign.title}</h3>

          <!-- Location and Beneficiaries -->
          <div class="flex items-center text-sm text-gray-600 mb-4">
            <div class="flex items-center mr-4">
              📍${campaign.location.city}
            </div>
            <div class="flex items-center">
              👥 Beneficiaries: ${campaign.Beneficiaries}
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-green-700 font-semibold">${percentage}%</span>
              <span class="text-gray-600 font-medium">${campaign.amountRaised} / ${campaign.targetAmount} USD</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-green-500 h-2.5 rounded-full" style="width: ${percentage}%"></div>
            </div>
          </div>

          <!-- Donation Input -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Donation Amount</label>
            <div class="flex">
              <input type="number" value="30" class="w-full border rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-green-300" />
              <span class="inline-flex items-center px-3 border-t border-b border-r border-gray-300 bg-gray-100 rounded-r-md text-sm">
                USD
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-2">
            <button class="flex-1 bg-green-600 text-white text-sm font-semibold py-2 rounded hover:bg-green-700 transition donate-btn">
              Donate
            </button>
            <a href="campaign/${campaign._id}"
              class="flex-1 border text-green-600 border-green-600 text-sm font-semibold py-2 rounded hover:bg-green-50 transition text-center block">
              Details
            </a>
            <button id="cart-btn" class="p-2 text-gray-500 hover:text-green-700">
              <!-- Cart Icon -->
              🛒
            </button>
          </div>
        </div>
      `;

  // Add to Cart functionality
  const cartBtn = card.querySelector("#cart-btn");
  const amountInput = card.querySelector('input[type="number"]');
  cartBtn.addEventListener("click", async () => {
    await addItemToCart({
      donationType: "campaign",
      recipientId: campaign._id,
      donationTypeRef: "Campaign",
      amount: parseInt(amountInput.value) || 1,
    });
  });

  return card;
};
