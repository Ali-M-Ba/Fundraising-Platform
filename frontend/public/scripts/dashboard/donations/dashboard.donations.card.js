export const dashboardDonationCard = (donation, idx) => {
  const {
    paymentMethod,
    transactionStatus,
    items = [],
    totalAmount,
    timestamp,
    _id,
  } = donation ?? {};

  const dateObj = new Date(timestamp);

  const day = dateObj.getDate(); // 24

  const monthYear = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(dateObj); // Jan 2026

  // Group items by donationType
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.donationType]) acc[item.donationType] = [];
    acc[item.donationType].push(item);
    return acc;
  }, {});

  // Styling per type
  const typeStyles = {
    campaign: {
      border: "border-green-600",
      label: "text-green-700",
      title: "Campaign",
    },
    orphan: {
      border: "border-blue-600",
      label: "text-blue-700",
      title: "Orphan",
    },
  };

  // Render grouped items
  const renderDonationGroups = Object.entries(groupedItems)
    .map(([type, typeItems]) => {
      const style = typeStyles[type] || {};

      const itemsHTML = typeItems
        .map(
          (item) => `
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-800 truncate">
              ${
                type === "campaign"
                  ? "Campaign #" + item.recipientId.slice(-4)
                  : "Sponsorship #" + item.recipientId.slice(-4)
              }
            </p>
            <span class="text-sm text-gray-900">$${item.amount.toFixed(
              2,
            )}</span>
          </div>
        `,
        )
        .join("");

      return `
        <div class="flex justify-between items-center bg-gray-50 p-2 border-l-4 ${
          style.border
        }">
          <div class="w-full">
            <p class="text-[10px] font-bold ${
              style.label
            } uppercase leading-none mb-1">
              ${style.title}
            </p>
            <div>
              ${itemsHTML}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="rounded-xl border shadow-sm hover:shadow-md transition p-4">
      <div class="flex items-center gap-6">
        
        <!-- Date -->
        <div class="text-gray-400 text-sm pr-4 border-r text-center min-w-[80px]">
          <span class="block font-bold text-gray-900">${day}</span>
         ${monthYear}
        </div>

        <!-- Donation Info -->
        <div class="min-w-[200px]">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="text-lg font-semibold text-gray-900">
              ${totalAmount} USD
            </h3>
            <span class="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-green-100 text-green-700">
              ${transactionStatus || "Paid"}
            </span>
          </div>
            <p class="text-xs text-gray-500 truncate w-40">
              ID: #${_id?.slice(-8)}
            </p>
          <div class="mt-2">
            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              💳 ${paymentMethod}
            </span>
          </div>
        </div>

        <!-- Donations Details -->
        <div class="flex-1 w-full">
          <div class="grid grid-cols-1 gap-2">
            ${renderDonationGroups}
          </div>
        </div>

        <!-- Donation Actions -->
        <div class="pl-6 border-l flex flex-col gap-2">
          <button class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
            View Receipt
          </button>
          <button class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
            Details
          </button>
        </div>

      </div>
    </div>
  `;
};
