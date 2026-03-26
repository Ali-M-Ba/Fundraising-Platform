import {
  escapeHtml,
  formatDate,
  numberWithCommas,
  truncate,
} from "../utils/dashboard.utils.js";

export const dashboardCampaignCard = (campaign, idx) => {
  const {
    title,
    images,
    location,
    beneficiaries,
    description,
    targetAmount,
    amountRaised,
    status,
    _id,
    startDate,
    endDate,
  } = campaign ?? {};

  const start = formatDate(startDate);
  const end = formatDate(endDate);
  const img = images?.[0] ?? "/images/orphanage-placeholder.png";
  const city = location?.city ?? "Unknown";
  const country = location?.country ?? "Unknown";
  const des = description ?? "Unknown";
  const target = Number(targetAmount || 0);
  const raised = Number(amountRaised || 0);
  const percent =
    target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
  const badge =
    String(status).toLowerCase() === "completed"
      ? { text: "Completed", cls: "bg-green-100 text-green-700" }
      : String(status).toLowerCase() === "cancelled"
        ? { text: "Cancelled", cls: "bg-red-100 text-red-700" }
        : {
            text: String(status || "Active"),
            cls: "bg-yellow-100 text-yellow-700",
          };
  const amtLabel = `$${numberWithCommas(raised)} / $${numberWithCommas(target)} USD`;

  return `<div data-campaign-id="${escapeHtml(idx)}" class="rounded-xl border shadow-sm hover:shadow-md transition p-4 bg-white">
        <div class="flex items-center gap-6">

          <div class="text-gray-400 text-sm pr-4 border-r">#${idx + 1}</div>

          <img src="${escapeHtml(img)}" alt="campaign image" class="w-16 h-16 rounded object-cover border" />

          <div class="min-w-[220px]">
            <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
            <p class="text-sm text-gray-500 mb-2">📍 ${city}${city && country ? ", " : ""}${country}</p>
            <p class="text-xs text-gray-500">Campaign ID: ${escapeHtml(_id)}</p>
          </div>

          <div class="flex-1 space-y-3">
            <div class="grid grid-cols-[250px_1fr_auto] gap-2 w-full text-sm text-gray-600">
              <!-- Dates -->
              <div class="flex gap-4"><span><strong>Start:</strong> ${start}</span><span><strong>End:</strong> ${end}</span></div>
              
              <!-- Beneficiaries -->
              <div>
              <strong>Beneficiaries:</strong> ${escapeHtml(beneficiaries)}
              </div>
              
              <!-- Badge -->
              <span class="px-3 py-1 text-xs font-semibold rounded-full ${badge.cls}">${escapeHtml(badge.text)}</span>
            </div>

            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="font-semibold text-green-700">${percent}% funded</span>
                <span class="text-gray-600">${escapeHtml(amtLabel)}</span>
              </div>

              <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div class="bg-green-500 h-2 rounded-full" style="width: ${percent}%"></div>
              </div>

            </div>
          </div>

          <div class="pl-6 border-l flex gap-3 text-sm font-medium">
            <a href="/dashboard/campaigns/edit/${encodeURIComponent(_id)}" class="px-3 py-1 text-sm text-green-700 bg-green-100 rounded hover:bg-green-200 transition edit-campaign">Edit</a>
            <button data-id="${escapeHtml(_id)}" class="px-3 py-1 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200 transition delete-campaign">Delete</button>
          </div>

        </div>
      </div>`;
};
