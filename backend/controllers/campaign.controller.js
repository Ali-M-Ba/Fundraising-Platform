import mongoose from "mongoose";
import { handleError } from "../utils/error.handler.js";
import { handleResponse } from "../utils/response.handler.js";
import Campaign from "../models/Campaign.model.js";

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().lean();

    handleResponse(res, 200, "Campaigns retrieved successfully!", {
      campaigns,
    });
  } catch (error) {
    console.log("Error fetching campaigns: ", error);
    handleError(res, error);
  }
};

export const getCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(campaignId))
      throw { status: 400, message: "Campaign ID is required." };

    const campaign = await Campaign.findById(campaignId).lean();
    if (!campaign) throw { status: 404, message: "Campaign doesn't exist." };

    handleResponse(res, 200, "Campaign retrieved successfully!", {
      campaign,
    });
  } catch (error) {
    console.log("Error fetching campaign: ", error);
    handleError(res, error);
  }
};

export const createCampaign = async (req, res) => {
  try {
    const campaignData = req.body;

    const campaign = new Campaign(campaignData);
    await campaign.save();

    handleResponse(res, 201, "Campaign created successfully!", {
      campaign,
    });
  } catch (error) {
    console.log("Error creating new campaign: ", error);
    handleError(res, error);
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const campaignData = req.body;
    if (!mongoose.Types.ObjectId.isValid(campaignId))
      throw { status: 400, message: "Campaign ID is required." };

    const campaign = await Campaign.findByIdAndUpdate(campaignId, campaignData, {
      new: true,
    }).lean();
    if (!campaign) throw { status: 404, message: "Campaign doesn't exist." };

    handleResponse(res, 200, "Campaigns updated successfully!", {
      campaign,
    });
  } catch (error) {
    console.log("Error updating campaign: ", error);
    handleError(res, error);
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(campaignId))
      throw { status: 400, message: "Campaign ID is required." };

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw { status: 404, message: "Campaign doesn't exist." };
    }

    const deletedCampaign = campaign.toObject();
    await campaign.deleteOne();

    handleResponse(res, 200, "Campaign deleted successfully!", {
      deletedCampaign,
    });
  } catch (error) {
    console.log("Error deleting campaign: ", error);
    handleError(res, error);
  }
};
