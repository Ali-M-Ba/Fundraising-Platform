import { showToast } from "./toast.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const result = await fetch("/api/cart/");
    const { success, data, message } = await result.json();
    showToast(message, success ? "success" : "error");

    const cartItemsContainer = document.getElementById("cart-items-container");
    cartItemsContainer.innerHTML = "";

    data.detailedCart.forEach((item) => {
      const card = document.createElement("div");
      card.classList = "border rounded-lg p-4 flex items-start justify-between";

      card.innerHTML = `
        <div class="flex items-start gap-4">
          <img src="${
            item.details?.images?.[0] ?? item.details?.photos?.[0]
          }" alt="Donation Image" class="w-16 h-16 object-cover rounded" />
          <div>
            <h3 class="text-lg font-semibold">${
              item.details?.title ?? item.details?.name.split(" ")[0]
            }</h3>
            <div class="text-sm text-gray-600 mb-2">Customise Amount Here</div>
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
            <div class="mt-2 text-sm">
              <span class="font-medium">Type:</span>
              <span class="text-green-700">${item.donationType}</span>
            </div>
          </div>
        </div>
        <button class="text-red-500 text-sm hover:underline">Remove</button>
      `;

      cartItemsContainer.appendChild(card);
    });

    // Add event listeners to all donation amount inputs
    const donationInputs = document.querySelectorAll(".donation-amount-input");
    const totalAmount = document.getElementById("total-amount");
    function updateTotal() {
      let total = 0;
      donationInputs.forEach((input) => {
        const val = parseFloat(input.value);
        if (!isNaN(val) && val > 0) total += val;
      });
      totalAmount.innerHTML = `${total} USD`;
    }
    donationInputs.forEach((input) => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "-" || e.key === "e" || e.key === ".") {
          e.preventDefault();
        }
      });
      input.addEventListener("input", (e) => {
        let value = e.target.value;
        if (value === "" || isNaN(value) || parseInt(value) < 1) {
          e.target.value = 1;
        }
        updateTotal();
      });
      input.addEventListener("change", (e) => {
        let value = e.target.value;
        if (value === "" || isNaN(value) || parseInt(value) < 1) {
          e.target.value = 1;
        }
        updateTotal();
      });
    });
    updateTotal();
  } catch (error) {
    console.log(error);
    showToast(error.message, error.success ? "success" : "error");
  }
});
