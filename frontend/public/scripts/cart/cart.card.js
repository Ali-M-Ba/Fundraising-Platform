import { showToast } from "../toast.js";

export const createCartItemCard = (item) => {
  console.log(item);
  const card = document.createElement("div");
  card.classList = "border rounded-lg p-4 flex items-start justify-between";
  const isOrphan = item.donationType === "orphan";

  card.innerHTML = `
    <div class="flex items-start gap-4">
      <img src="${
        item.details?.images?.[0] ?? item.details?.photos?.[0]
      }" alt="Donation Image" class="w-16 h-16 object-cover rounded" />
      <div class="w-full">
        <h3 class="text-lg font-semibold">${
          item.details?.title ?? item.details?.name.split(" ")[0]
        }</h3>
        <div class="text-sm text-gray-600 mb-2">Customise Amount Here</div>

        ${
          isOrphan
            ? `
            <div class="flex w-80 justify-between items-center gap-2 mb-4">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="decrement-btn w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value="${item.amount / 100}"
                  class="amount-input w-12 text-center border rounded px-1 py-1 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  class="increment-btn w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300"
                >
                  +
                </button>
                <span class="text-lg font-bold text-green-600">
                  x 100 USD
                </span>
              </div>
              <span class="result-value text-lg font-bold text-green-700" data-amount="100">
                ${item.amount} USD
              </span>
            </div>
            `
            : `
            <input
              id="donation-amount-${item._id}"
              class="w-24 border rounded px-2 py-1 text-sm donation-amount-input"
              type="number"
              min="1"
              step="1"
              value="${item.amount}"
              pattern="^[1-9][0-9]*$"
              required
            />
            <span class="text-sm">USD</span>
            `
        }

        <div class="mt-2 text-sm">
          <span class="font-medium">Type:</span>
          <span class="text-green-700">${item.donationType}</span>
        </div>
      </div>
    </div>
    <button id="remove-btn" class="text-red-500 text-sm hover:underline">Remove</button>
  `;

  const removeBtn = card.querySelector("#remove-btn");

  async function updateCartAmount(recipientId, newAmount) {
    try {
      const res = await fetch(`/api/cart/${recipientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: newAmount }),
      });

      const { message, success } = await res.json();
      showToast(message, success ? "success" : "error");
    } catch (err) {
      console.error("Failed to update amount:", err);
      showToast("Failed to update cart", "error");
    }
  }

  if (isOrphan) {
    const amountInput = card.querySelector(".amount-input");
    const resultValue = card.querySelector(".result-value");
    const decrementBtn = card.querySelector(".decrement-btn");
    const incrementBtn = card.querySelector(".increment-btn");
    const unitPrice = 100;

    function updateResult() {
      let amount = parseInt(amountInput.value) || 1;
      if (amount < 1) amount = 1;
      amountInput.value = amount;
      const total = amount * unitPrice;
      resultValue.textContent = `${total} USD`;
      resultValue.dataset.amount = total;
      updateCartAmount(item.recipientId, total);
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
  } else {
    const donationInput = card.querySelector(`#donation-amount-${item._id}`);
    if (donationInput) {
      donationInput.addEventListener("change", () => {
        const newAmount = parseInt(donationInput.value) || 1;
        if (newAmount < 1) {
          donationInput.value = 1;
        }
        updateCartAmount(item.recipientId, donationInput.value);
      });
    }
  }

  if (removeBtn) {
    removeBtn.addEventListener("click", async () => {
      try {
        const res = await fetch(`/api/cart/${item.recipientId}`, {
          method: "DELETE",
        });
        const { message, success } = await res.json();
        showToast(message, success ? "success" : "error");
      } catch (error) {
        console.log(error);
        showToast("Something went wrong", "error");
      }
    });
  }

  return card;
};
