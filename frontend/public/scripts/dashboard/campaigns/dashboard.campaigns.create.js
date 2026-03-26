import { showToast } from "../../toast.js";
import { formDataToNestedObject } from "../utils/dashboard.utils.js";
import { createCampaign } from "./dashboard.campaigns.api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const formDataObj = formDataToNestedObject(formData);
    console.log(formDataObj)

    try {
      const { success, message, data } = await createCampaign(formDataObj);
      showToast(message, success ? "success" : "error");
    } catch (error) {
      console.log(error);
    }
  });
});
