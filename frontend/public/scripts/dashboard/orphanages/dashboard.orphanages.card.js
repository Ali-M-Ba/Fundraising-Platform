import { escapeHtml, truncate } from "../utils/dashboard.utils.js";

export const dashboardOrphanageCard = (orphanage, idx) => {
  const { name, images, location, contact, description } = orphanage ?? {};

  const img = images?.[0] ?? "/images/orphanage-placeholder.png";
  const city = location?.city ?? "Unknown";
  const country = location?.country ?? "Unknown";
  const email = contact?.email ?? "Unknown";
  const phone = contact?.phone ?? "Unknown";
  const des = description ?? "Unknown";
  return `
        <div class="px-6 py-5 rounded-xl border shadow-sm hover:shadow-md transition">
          <div class="flex items-center justify-between gap-6">
            <span class="text-sm font-semibold text-gray-500">#${idx + 1}</span>
            <img class="w-12 h-12 rounded-full object-cover border" src="${img}" alt="Orphanage logo" />
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800">${escapeHtml(name ?? "Untitled")}</h3>
              <div class="flex gap-1 text-sm text-gray-500">
                <span>📍</span>
                <span>${escapeHtml(country)}</span>
                <span>•</span>
                <span>${escapeHtml(city)}</span>
              </div>
              ${des ? `<p class="text-sm text-gray-600 mt-2">${escapeHtml(truncate(des, 120))}</p>` : ""}
            </div>
            <div class="md:flex flex-col text-sm text-gray-600">
              <span>${escapeHtml(email)}</span>
              <span>${escapeHtml(phone)}</span>
            </div>
            <div class="flex items-center gap-3">
              <a href="/dashboard/orphanages/edit/${orphanage?._id ?? "#"}" class="px-3 py-1 text-sm text-green-700 bg-green-100 rounded hover:bg-green-200 transition">Edit</a>
              <button data-id="${orphanage?._id ?? "#"}" class="delete-orphanage px-3 py-1 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200 transition">Delete</button>
            </div>
          </div>
        </div>`;
};
