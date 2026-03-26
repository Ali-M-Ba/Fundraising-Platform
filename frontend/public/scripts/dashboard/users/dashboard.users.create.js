import { showToast } from "../../toast.js";
import { formDataToNestedObject } from "../utils/dashboard.utils.js";
import { createUser } from "./dashboard.users.api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const body = formDataToNestedObject(formData);

    try {
      const { success, message } = await createUser(body);
      showToast(message, success ? "success" : "error");
      if (success) {
        form.reset();
      }
    } catch (error) {
      showToast("Failed to create user.", "error");
      console.error(error);
    }
  });
});
