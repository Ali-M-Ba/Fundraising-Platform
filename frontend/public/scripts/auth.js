import { showToast } from "./toast.js";
const form = document.querySelector("form");
const emailError = document.querySelector(".email.error");
const passwordError = document.querySelector(".password.error");

// Function to display errors in the corresponding divs
const displayErrors = (errors) => {
  // Clear previous error messages
  emailError.textContent = "";
  passwordError.textContent = "";

  // Loop through errors' messages and populate the relevant error divs
  errors.forEach((err) => {
    if (err.toLowerCase().includes("email")) {
      emailError.textContent = err;
    } else if (err.toLowerCase().includes("password")) {
      passwordError.textContent = err;
    }
  });
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      // Display errors if the response is not OK
      displayErrors(data.errors || [data.message]);
    } else {
      console.log("Login successful!");
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Something went wrong:", error);
  }
});
