import { showToast } from "../../toast.js";
import { formDataToNestedObject } from "../utils/dashboard.utils.js";
import { createOrphanage } from "./dashboard.orphanages.api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const formDataObj = formDataToNestedObject(formData);

    try {
      const { success, message, data } = await createOrphanage(formDataObj);
      showToast(message, success ? "success" : "error");
    } catch (error) {
      console.log(error);
    }
  });
});
