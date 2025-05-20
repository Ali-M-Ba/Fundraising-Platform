// // Add event listeners to all donation amount inputs
export const updateTotalAmount = (donationInputs, totalAmount) => {
  const updateTotal = () => {
    let total = 0;
    donationInputs.forEach((input) => {
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
  updateTotal();
};
