import User from "../models/User.model.js";
import Campaign from "../models/Campaign.model.js";
import Donation from "../models/Donation.model.js";
import Orphan from "../models/Orphan.model.js";
import Orphanage from "../models/Orphanage.model.js";
import { handleResponse } from "../utils/response.handler.js";
import { handleError } from "../utils/error.handler.js";

export const getOverviewStats = async (req, res) => {
  try {
    const [
      userCount,
      orphanageCount,
      orphanCount,
      sponsoredOrphanCount,
      campaignCount,
      runningCampaignCount,
      finishedCampaignCount,
      donationCount,
    ] = await Promise.all([
      User.countDocuments(),
      Orphanage.countDocuments(),
      Orphan.countDocuments(),
      Orphan.countDocuments({ isSponsored: true }),
      Campaign.countDocuments(),
      Campaign.countDocuments({ status: "active" }),
      Campaign.countDocuments({ status: "completed" }),
      Donation.countDocuments(),
    ]);

    // const campaignStatusCounts = await Campaign.aggregate([
    //   {
    //     $group: {
    //       _id: "$status",
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);

    const result = await Donation.aggregate([
      {
        $match: {
          transactionStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalReceived: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalReceived = result[0]?.totalReceived || 0;

    handleResponse(res, 200, "Stats retrieved successfully.", {
      userCount,
      orphanageCount,
      orphanCount,
      sponsoredOrphanCount,
      campaignCount,
      runningCampaignCount,
      finishedCampaignCount,
      donationCount,
      totalReceived,
    });
  } catch (error) {
    console.error("Error occurred while fetching stats:", error);
    handleError(res, error);
  }
};
