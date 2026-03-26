export async function fetchAndSumData(orphanageId) {
  try {
    // Fetch all data in parallel
    const [orphanRes, campaignRes, donationRes] = await Promise.all([
      fetch("/api/orphan"),
      fetch("/api/campaign"),
      fetch("/api/donation"),
    ]);

    const orphanJson = await orphanRes.json();
    const campaignJson = await campaignRes.json();
    const donationJson = await donationRes.json();

    const allOrphans = orphanJson.data.orphans || [];
    const allCampaigns = campaignJson.data.campaigns || [];
    const allDonations = donationJson.data.donations || [];

    // Filter data by orphanageId
    const orphans = allOrphans.filter(o => o.orphanageId === orphanageId);
    const campaigns = allCampaigns.filter(c => c.orphanageId === orphanageId);
    const donations = allDonations.filter(d => d.orphanageId === orphanageId);

    const activeCampaigns = campaigns.filter(c => c.status !== "completed");
    const completedCampaigns = campaigns.filter(c => c.status === "completed");

    const totalCount = orphans.length + activeCampaigns.length;

    return {
      totalCount,
      orphans,
      donations,
      campaigns: {
        active: activeCampaigns,
        completed: completedCampaigns,
      },
      counts: {
        campaigns: campaigns.length,
        orphans: orphans.length,
        activeCampaigns: activeCampaigns.length,
        completedCampaigns: completedCampaigns.length,
        donations: donations.length,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      totalCount: 0,
      orphans: [],
      donations: [],
      campaigns: {
        active: [],
        completed: [],
      },
      counts: {
        orphans: 0,
        activeCampaigns: 0,
        completedCampaigns: 0,
        donations: 0,
      },
      error: error.message,
    };
  }
}
