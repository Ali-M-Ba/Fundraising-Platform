document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/stats/overview");
    const json = await res.json();
    const stats = json.data || json;
    console.log(stats);

    const fmtNumber = (n) =>
      n === undefined || n === null ? "0" : Intl.NumberFormat().format(n);
    const fmtCurrency = (n) => {
      if (n === undefined || n === null) return "$0";
      if (typeof n === "number")
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(n);
      return String(n);
    };

    const set = (id, value) => {
      const el = document.querySelector(`#${id}`);
      if (!el) return;
      el.textContent = value;
    };

    set("campaignsNumber", fmtNumber(stats.campaignCount));
    set("runningCampaignsNumber", fmtNumber(stats.runningCampaignCount));
    set("finishedCampaignsNumber", fmtNumber(stats.finishedCampaignCount));
    set("orphanagesNumber", fmtNumber(stats.orphanageCount));
    set("orphansNumber", fmtNumber(stats.orphanCount));
    set("sponsorshipsNumber", fmtNumber(stats.sponsoredOrphanCount));
    set("donationsNumber", fmtNumber(stats.donationCount));
    // total donations amount may be provided as `totalDonations` or `donationAmount`
    const totalAmt = stats.totalReceived ?? null;
    set("totalDonationsAmount", fmtCurrency(totalAmt));
    set("usersNumber", fmtNumber(stats.userCount));
  } catch (err) {
    console.error("Failed to load overview stats", err);
  }
});
