import { createCartItemCard } from "./cart.card.js";
import { showToast } from "../toast.js";
import { updateTotalAmount } from "./cart.utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const result = await fetch("/api/cart/");
    const { success, data, message } = await result.json();
    showToast(message, success ? "success" : "error");

    const cartItemsContainer = document.getElementById("cart-items-container");
    cartItemsContainer.innerHTML = "";

    data.detailedCart.forEach((item) => {
      const card = createCartItemCard(item);
      cartItemsContainer.appendChild(card);
    });

    // Add event listeners to all donation amount inputs
    const donationInputs = document.querySelectorAll(".donation-amount-input");
    const totalAmount = document.getElementById("total-amount");

    updateTotalAmount(donationInputs, totalAmount);
  } catch (error) {
    console.log(error);
    showToast(error.message, error.success ? "success" : "error");
  }
});
