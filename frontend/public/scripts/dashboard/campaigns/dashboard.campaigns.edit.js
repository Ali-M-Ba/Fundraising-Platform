import { showToast } from "../../toast.js";
import {
  fillForm,
  formatDate,
  formDataToNestedObject,
  getActionId,
} from "../utils/dashboard.utils.js";
import {
  createCampaign,
  fetchDashboardCampaign,
  updateCampaign,
} from "./dashboard.campaigns.api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const id = getActionId();
  try {
    const {
      success,
      message,
      data: { campaign },
    } = await fetchDashboardCampaign(id);
    showToast(message, success ? "success" : "error");

    // endDate: "2025-06-30T00:00:00.000Z"

    fillForm(campaign);
  } catch (error) {
    console.error(error);
  }

  const form = document.querySelector("form");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const formDataObj = formDataToNestedObject(formData);

    try {
      const { success, message, data } = await updateCampaign(id, formDataObj);
      showToast(message, success ? "success" : "error");
    } catch (error) {
      console.log(error);
    }
  });
});
