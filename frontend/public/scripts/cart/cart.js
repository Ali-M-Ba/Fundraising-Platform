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

    const donateBtn = document.getElementById("donate");
    donateBtn.addEventListener("click", async () => {
      try {
        const response = await fetch("/api/donation/donate", {
          method: "POST",
          credentials: "include", // required if using cookies/session
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Donation request failed:", errorText);
          showToast("Failed to initiate donation. Try again.", "error");
          return;
        }

        const { data } = await response.json();

        if (data?.sessionURL) {
          // Redirect to Stripe Checkout
          window.location.href = data.sessionURL;
        } else {
          console.warn("No session URL returned from server.");
          showToast("Donation session could not be started.", "error");
        }
      } catch (error) {
        console.error("Error during donation:", error);
        showToast("Something went wrong. Please try again later.", "error");
      }
    });
  } catch (error) {
    console.log(error);
    showToast(error.message, error.success ? "success" : "error");
  }
});
