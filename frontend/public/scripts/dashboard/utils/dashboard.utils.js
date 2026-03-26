export const truncate = (str, n) => {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
};

export const escapeHtml = (unsafe) => {
  if (!unsafe && unsafe !== 0) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const formDataToNestedObject = (formData, separator = "-") => {
  const formDataObj = Object.fromEntries(formData);
  console.log(formDataObj);
  let result = {};

  for (const [inputName, value] of Object.entries(formDataObj)) {
    if (!inputName.includes("-")) {
      result[inputName] = value;
      continue;
    }

    const parts = inputName.split(separator); // [location, country]

    let current = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]; // location

      if (i === parts.length - 1) {
        current[part] = value; // USA
      } else {
        if (!current[part]) current[part] = {}; // current[location] = {} => current.location = {}
        current = current[part]; // current = current[location] => moving the pointer to current.location
      }
    }
  }
  return result;
};

export function getActionId(
  actions = ["edit", "delete"],
  url = window.location.pathname,
) {
  const match = url.match(new RegExp(`/(?:${actions.join("|")})/([^/]+)`));
  return match ? match[1] : null;
}

export function fillForm(obj) {
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      fillForm(value);
    }

    if (value && typeof value === "object" && Array.isArray(value)) {
      for (const arrayObj of value) fillForm(arrayObj);
    }

    const el = document.getElementById(key);
    if (el) {
      if (el.type === "date") {
        el.value = formatDateForInput(value);
      } else if (el.type === "checkbox") {
        el.checked = value;
      } else {
        el.value = value;
      }
    }
  }
}

export function numberWithCommas(x) {
  if (x === null || x === undefined || Number.isNaN(Number(x))) return "0";
  return Number(x).toLocaleString();
}

export function formatDate(d) {
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return "-";
    return dt.toLocaleDateString();
  } catch (e) {
    return "-";
  }
}

// Format date for <input type="date"> (YYYY-MM-DD)
export function formatDateForInput(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return "";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
