import { escapeHtml } from "../utils/dashboard.utils.js";

export const dashboardOrphanCard = (orphan, idx) => {
  const { name, photos, location, age, gender, healthStatus, isSponsored } =
    orphan ?? {};

  const photo = photos?.[0] ?? "/images/orphanage-placeholder.png";
  const city = location?.city ?? "";
  const country = location?.country ?? "";
  const health = healthStatus ?? "Unknown";
  const sponsored = isSponsored ? "Yes" : "No";
  return `
    <div class="grid grid-cols-[60px_70px_1.5fr_1.5fr_80px_90px_120px_120px_140px] items-center gap-y-2 px-6 py-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition">
      <span class="text-sm font-semibold text-gray-500">#${idx + 1}</span>
      <img class="w-12 h-12 rounded-full object-cover border" src="${escapeHtml(photo)}" alt="Orphan photo" />
      <h3 class="text-normal font-semibold text-gray-800">${escapeHtml(name)}</h3>
      <span class="text-sm text-gray-600">📍 ${escapeHtml(city)}${city && country ? ", " : ""}${escapeHtml(country)}</span>
      <span class="text-sm text-gray-600">${escapeHtml(String(age))}</span>
      <span class="text-sm text-gray-600">${escapeHtml(gender)}</span>
      <span class="text-sm font-medium ${String(health).toLowerCase().includes("health") || String(health).toLowerCase().includes("good") ? "text-green-600" : "text-red-600"}">${escapeHtml(health)}</span>
      <span class="text-sm font-medium ${orphan.isSponsored ? "text-green-600" : "text-red-600"}">${escapeHtml(sponsored)}</span>
      <div class="flex justify-center gap-2">
        <a href="/dashboard/orphans/edit/${escapeHtml(orphan?._id ?? "#")}\" class="px-3 py-1 text-sm text-green-700 bg-green-100 rounded hover:bg-green-200 transition edit-orphan">Edit</a>
        <button data-id="${escapeHtml(orphan?._id ?? "#")}" class="px-3 py-1 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200 transition delete-orphan">Delete</button>
      </div>
    </div>`;
};
