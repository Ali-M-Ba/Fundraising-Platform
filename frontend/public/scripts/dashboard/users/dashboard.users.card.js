import { escapeHtml } from "../utils/dashboard.utils.js";

export const dashboardUserCard = (user, idx) => {
  const { _id, fullName, email, phone, role, address } = user ?? {};
  const location = [address?.city, address?.country].filter(Boolean).join(", ");

  return `
    <div data-user-id="${escapeHtml(_id)}" class="grid grid-cols-[40px_2.6fr_2.4fr_1.6fr_1fr_2fr] items-center gap-y-2 px-6 py-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition">
      <span class="text-sm font-semibold text-gray-500">#${idx + 1}</span>
      <div class="text-sm font-semibold text-gray-800">${escapeHtml(fullName)}</div>
      <div class="text-sm text-gray-600 truncate">${escapeHtml(email)}</div>
      <div class="text-sm text-gray-600">${escapeHtml(phone)}</div>
      <div class="text-sm font-medium capitalize ${escapeHtml(role) === "admin" ? "text-green-600" : "text-gray-600"}">${escapeHtml(role)}</div>
      <div class="flex justify-center gap-2">
        <button data-id="${escapeHtml(_id)}" class="px-3 py-1 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200 transition delete-user">
          Delete
        </button>
      </div>
    </div>`;
};
