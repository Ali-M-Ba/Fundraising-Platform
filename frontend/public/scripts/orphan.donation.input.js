// Reusable Orphan Donation Input Component
// Usage: const { element, getAmount } = createOrphanDonationInput({ unitPrice: 100, initialAmount: 1 });

export function createOrphanDonationInput({
  unitPrice = 100,
  initialAmount = 1,
} = {}) {
  // Create wrapper div
  const wrapper = document.createElement("div");
  wrapper.className = "flex justify-between items-center gap-2 mb-4";

  // Inner HTML
  wrapper.innerHTML = `
    <div class="flex items-center gap-2">
      <button type="button" class="decrement-btn w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300">-</button>
      <input type="number" min="1" value="${initialAmount}" class="amount-input w-12 text-center border rounded px-1 py-1 text-sm focus:outline-none" />
      <button type="button" class="increment-btn w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-lg font-bold hover:bg-gray-300">+</button>
      <span class="text-lg font-bold text-green-600">x ${unitPrice} USD</span>
    </div>
    <span class="result-value text-lg font-bold text-green-700">${
      initialAmount * unitPrice
    } USD</span>
  `;

  // Element references
  const amountInput = wrapper.querySelector(".amount-input");
  const resultValue = wrapper.querySelector(".result-value");
  const decrementBtn = wrapper.querySelector(".decrement-btn");
  const incrementBtn = wrapper.querySelector(".increment-btn");

  // Update result function
  function updateResult() {
    let amount = parseInt(amountInput.value) || 1;
    if (amount < 1) amount = 1;
    amountInput.value = amount;
    resultValue.textContent = `${amount * unitPrice} USD`;
  }

  amountInput.addEventListener("input", () => {
    // Only update the result, do not change the value
    updateResult();
  });
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

  // Return the element and a getter for the amount
  return {
    element: wrapper,
    getTotal: () => (parseInt(amountInput.value) || 1) * unitPrice,
  };
}
