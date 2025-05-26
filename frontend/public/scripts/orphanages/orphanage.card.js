export const renderOrphanageCard = (orphanage) => {
  const card = document.createElement("div");
  card.classList = "bg-white rounded-xl shadow-md p-5";
  card.innerHTML = `
      <div class="flex items-start gap-4">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <img src="${orphanage.images[0]}" alt="Charity Logo" class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-200">
      </div>

      <!-- Content -->
      <div class="flex-grow text-left">
        <h3 class="text-lg font-semibold text-slate-800 mb-1">${orphanage.name}</h3>
        <p class="text-xs text-teal-600 font-medium mb-2">📍 ${orphanage.location.city}</p>
        <p class="text-sm text-gray-600 leading-relaxed mb-3">
          ${orphanage.description}
        </p>
        <a href="/orphanage?id=${orphanage._id}" class="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">View Details</a>
      </div>
    </div>
  `;

  return card;
};
