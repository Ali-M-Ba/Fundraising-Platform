export const createCartItemCard = (item) => {
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
        <button id="remove-btn" class="text-red-500 text-sm hover:underline">Remove</button>
      `;

  try {
    const removeBtn = card.querySelector("#remove-btn");
    removeBtn.addEventListener("click", async () => {
      await fetch(`/api/cart/${item.recipientId}`, {
        method: "DELETE",
      });
    });
  } catch (error) {
    console.log(error);
  }

  return card;
};
