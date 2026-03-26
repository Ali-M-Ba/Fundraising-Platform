// // Add event listeners to all donation amount inputs
export const updateTotalAmount = (donationInputs, totalAmount) => {
  const updateTotal = () => {
    let total = 0;
    // Sum orphan result-values using data-amount
    document.querySelectorAll(".result-value").forEach((el) => {
      const val = parseFloat(el.dataset.amount);
      if (!isNaN(val) && val > 0) total += val;
    });
    // Sum campaign input values
    document.querySelectorAll(".donation-amount-input").forEach((input) => {
      const val = parseFloat(input.value);
      if (!isNaN(val) && val > 0) total += val;
    });
    totalAmount.innerHTML = `${total} USD`;
  };

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

  // Listen for changes to orphan amount/total as well
  document
    .querySelectorAll(".amount-input, .decrement-btn, .increment-btn")
    .forEach((el) => {
      el.addEventListener("input", updateTotal);
      el.addEventListener("click", updateTotal);
    });

  updateTotal();
};
