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
