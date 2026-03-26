export const getQueryParam = (name, defaultValue = null) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name) || defaultValue;
};

export const renderByType = (type) => {
  const typeToButtonId = {
    campaigns: "campaign-btn",
    orphans: "orphan-btn",
  };

  const buttonId = typeToButtonId[type];
  if (buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.click();
    } else {
      console.warn(`Button with ID "${buttonId}" not found.`);
    }
  } else {
    console.warn(`Unsupported type: "${type}"`);
  }
};

export function setActiveButton(activeBtn, inactiveBtn) {
  activeBtn.classList.remove(
    "bg-gray-200",
    "text-gray-700",
    "hover:bg-gray-300"
  );
  activeBtn.classList.add("bg-green-600", "text-white", "hover:bg-green-700");

  inactiveBtn.classList.remove(
    "bg-green-600",
    "text-white",
    "hover:bg-green-700"
  );
  inactiveBtn.classList.add(
    "bg-gray-200",
    "text-gray-700",
    "hover:bg-gray-300"
  );
}
