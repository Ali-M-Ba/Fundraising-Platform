import { showToast } from "../../toast.js";
import {
  fillForm,
  formDataToNestedObject,
  getActionId,
} from "../utils/dashboard.utils.js";
import { fetchDashboardOrphan, updateOrphan } from "./dashboard.orphans.api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const id = getActionId();
  try {
    const {
      success,
      message,
      data: { orphan },
    } = await fetchDashboardOrphan(id);
    showToast(message, success ? "success" : "error");

    if (success && orphan) {
      fillForm(orphan);
    }
  } catch (error) {
    console.error(error);
  }

  const form = document.querySelector("form");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const formDataObj = formDataToNestedObject(formData);
    formDataObj.isSponsored = formData.has("isSponsored");
    
    try {
      const { success, message } = await updateOrphan(id, formDataObj);
      showToast(message, success ? "success" : "error");
    } catch (error) {
      console.log(error);
    }
  });
});
