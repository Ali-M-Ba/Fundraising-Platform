// toast.js

function getToastContainer() {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = `
      fixed bottom-6 left-1/2 transform -translate-x-1/2
      z-50 space-y-2 flex flex-col items-center
    `;
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(message, type = "success", duration = 3000) {
  const container = getToastContainer();

  const toast = document.createElement("div");
  toast.className = `
    max-w-sm w-full px-4 py-2 rounded shadow-lg text-white opacity-0 transition-opacity duration-300
    ${
      type === "success"
        ? "bg-green-600"
        : type === "error"
        ? "bg-red-600"
        : "bg-gray-800"
    }
  `;
  toast.textContent = message;

  container.appendChild(toast);

  // Fade in
  requestAnimationFrame(() => {
    toast.classList.add("opacity-100");
  });

  // Fade out and remove after duration
  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 300); // Remove after transition
  }, duration);
}
