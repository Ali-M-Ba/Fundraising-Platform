import { showToast } from "../../toast.js";
import {
  fillForm,
  formDataToNestedObject,
  getActionId,
} from "../utils/dashboard.utils.js";
import {
  updateOrphanage,
  fetchDashboardOrphanage,
} from "./dashboard.orphanages.api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const id = getActionId();
  try {
    const {
      success,
      message,
      data: { orphanage },
    } = await fetchDashboardOrphanage(id);
    showToast(message, success ? "success" : "error");

    fillForm(orphanage);
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
      const { success, message, data } = await updateOrphanage(id, formDataObj);
      showToast(message, success ? "success" : "error");
    } catch (error) {
      console.log(error);
    }
  });
});
