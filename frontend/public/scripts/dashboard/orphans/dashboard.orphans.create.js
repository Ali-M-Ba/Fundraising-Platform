import { showToast } from "../../toast.js";
import { formDataToNestedObject } from "../utils/dashboard.utils.js";
import { createOrphan } from "./dashboard.orphans.api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const formDataObj = formDataToNestedObject(formData);
    formDataObj.isSponsored = formData.has("isSponsored");

    try {
      const { success, message } = await createOrphan(formDataObj);
      showToast(message, success ? "success" : "error");
      if (success) {
        form.reset();
      }
    } catch (error) {
      console.log(error);
    }
  });
});
