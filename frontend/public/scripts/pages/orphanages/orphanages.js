import { showToast } from "/scripts/toast.js";
import { renderOrphanageCard } from "./orphanage.card.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/orphanage");
    const { success, data, message } = await res.json();
    showToast(message, success ? "success" : "error");

    const container = document.getElementById("cards-container");
    container.innerHTML = "";

    data.orphanages.forEach((orphanage) => {
      const card = renderOrphanageCard(orphanage);
      container.appendChild(card);
    });
  } catch (error) {
    console.log(error);
    showToast(error.message, error.success ? "success" : "error");
  }
});
