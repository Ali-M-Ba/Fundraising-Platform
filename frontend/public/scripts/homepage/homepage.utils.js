export async function fetchAndSumData() {
  try {
    // Fetch orphans, campaigns, and donations in parallel
    const [orphanRes, campaignRes, donationRes] = await Promise.all([
      fetch("/api/orphan"),
      fetch("/api/campaign"),
      fetch("/api/donation"),
    ]);

    const orphanJson = await orphanRes.json();
    const campaignJson = await campaignRes.json();
    const donationJson = await donationRes.json();

    const orphans = orphanJson.data.orphans || [];
    const allCampaigns = campaignJson.data.campaigns || [];
    const donations = donationJson.data.donations || [];

    // Separate active and completed campaigns
    const activeCampaigns = allCampaigns.filter(
      (campaign) => campaign.status !== "completed"
    );
    const completedCampaigns = allCampaigns.filter(
      (campaign) => campaign.status === "completed"
    );

    // Total count is orphans + active campaigns
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
        campaigns: allCampaigns.length,
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
