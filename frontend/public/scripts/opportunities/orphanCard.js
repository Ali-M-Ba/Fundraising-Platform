import { addItemToCart } from "./api.opportunities.js";

export const createOrphanCard = (orphan) => {
  const card = document.createElement("div");
  card.className =
    "max-w-sm rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white relative";

  card.innerHTML = `
              <!-- Image -->
              <img class="w-full h-40 object-cover" src="${
                orphan.photos[0]
              }" alt="${orphan.name.split(" ")[0]}">
              
              <!-- Content -->
              <div class="p-4">
                <h2 class="text-lg font-semibold capitalize mb-2">${
                  orphan.name.split(" ")[0]
                }</h2>
  
                <!-- Location -->
                <div class="flex items-center text-sm text-gray-600 mb-2">
                  📍 ${orphan.location.city}
                </div>
  
                <!-- Attributes -->
                <div class="grid grid-cols-3 gap-2 text-xs text-gray-700 mb-4">
                  <div class="flex items-center space-x-1">
                    🧒
                    <span>${orphan.age}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    ❤️‍🩹
                    <span>${orphan.healthStatus}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    🚻
                    <span>${orphan.gender}</span>
                  </div>
                </div>
  
                <!-- Price -->
                <div class="flex justify-between items-center gap-2 mb-4">
                  <div class="flex items-center gap-2">
                    <button type="button" class="decrement-btn w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300">-</button>
                    <input type="number" min="1" value="1" class="amount-input w-12 text-center border rounded px-1 py-1 text-sm focus:outline-none" />
                    <button type="button" class="increment-btn w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300">+</button>
                    <span class="text-lg font-bold text-green-600">x 100 USD</span>
                  </div>
                  <span class="result-value text-lg font-bold text-green-700">100 USD</span>
                </div>
  
                <!-- Buttons -->
                <div class="flex space-x-2">
                  <button class="flex-1 bg-green-600 text-white text-sm font-semibold py-2 rounded hover:bg-green-700 transition">
                    Subscribe
                  </button>
                  <button class="flex-1 border text-green-600 border-green-600 text-sm font-semibold py-2 rounded hover:bg-green-50 transition">
                    Details
                  </button>
                  <button id="cart-btn" class="p-2 text-gray-500 hover:text-green-700">
                    <!-- Cart Icon -->
                    🛒
                  </button>
                </div>
              </div>
            `;

  const amountInput = card.querySelector(".amount-input");
  const resultValue = card.querySelector(".result-value");
  const decrementBtn = card.querySelector(".decrement-btn");
  const incrementBtn = card.querySelector(".increment-btn");
  const unitPrice = 100;

  function updateResult() {
    let amount = parseInt(amountInput.value) || 1;
    if (amount < 1) amount = 1;
    amountInput.value = amount;
    resultValue.textContent = `${amount * unitPrice} USD`;
  }

  amountInput.addEventListener("input", updateResult);
  decrementBtn.addEventListener("click", () => {
    let amount = parseInt(amountInput.value) || 1;
    if (amount > 1) amount--;
    amountInput.value = amount;
    updateResult();
  });
  incrementBtn.addEventListener("click", () => {
    let amount = parseInt(amountInput.value) || 1;
    amount++;
    amountInput.value = amount;
    updateResult();
  });
  updateResult();

  const cartBtn = card.querySelector("#cart-btn");
  cartBtn.addEventListener("click", async () => {
    await addItemToCart({
      donationType: "orphan",
      recipientId: orphan._id,
      donationTypeRef: "Orphan",
      amount: parseInt(resultValue.textContent) || 1,
    });
  });

  return card;
};
