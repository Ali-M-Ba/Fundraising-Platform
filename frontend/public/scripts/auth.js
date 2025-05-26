import { showToast } from "./toast.js";
const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (!res.ok) {
      showToast(data.message, "error");
    } else {
      console.log("Login successful!");
      showToast(data.message, "success");
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Something went wrong:", error);
    showToast(data.message, "error");
  }
});
