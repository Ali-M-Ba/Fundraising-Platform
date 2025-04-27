import mongoose from "mongoose";
import Donation from "../models/Donation.model.js";
import Campaign from "../models/Campaign.model.js";
import { stripe } from "../config/stripe.js";
import { getDonationRecipients } from "./cart.utils.js";

export const calculateDonationSummary = (cart) => {
  const lineItems = cart.map((item) => {
    const isCampaign = item.donationType === "campaign";

    const images = isCampaign
      ? item.details?.images
      : item.details?.photos ?? [];
    const name = isCampaign ? item.details?.title : item.details?.name ?? "";
    const amount = Math.round(item.amount * 100); // Convert to cents

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name,
          images,
        },
        unit_amount: amount,
      },
      quantity: 1,
    };
  });

  return lineItems;
};

// Creates a Stripe checkout session.
export const generateCheckoutSession = async (userId, lineItems, cart) => {
  try {
    return await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `{process.env.CLIENT_URL}/success-donate?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      metadata: {
        userId: userId,
        orphanageId: userId,
        itemsData: JSON.stringify(cart.map((item) => item)),
      },
    });
  } catch (error) {
    console.error("Error creating a stripe session: ", error);
    throw error;
  }
};

// Used after successful payment
export const updateItemsData = async (cart) => {
  const { orphans, campaigns } = await getDonationRecipients(cart);

  for (const campaign of campaigns) {
    const match = cart.find(
      (item) => item.recipientId === campaign._id.toString()
    );
    if (!match) continue;

    const newAmountRaised = campaign.amountRaised + match.amount;

    await Campaign.updateOne(
      { _id: campaign._id },
      {
        $inc: { amountRaised: match.amount },
        ...(newAmountRaised >= campaign.targetAmount && {
          $set: { status: "completed" },
        }),
      }
    );
  }
};

export const getPaymentMethod = async (session) => {
  const paymentIntentId = session.payment_intent;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // This contains the ID of the actual payment method used
  const paymentMethodId = paymentIntent.payment_method;

  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  return paymentMethod;
};

// Get all the donations docs
export const fetchAllDonations = async () => {
  const orphanDonations = await aggregateDonations("Orphan", "orphans");
  const campaignDonations = await aggregateDonations("Campaign", "campaigns");

  return [...orphanDonations, ...campaignDonations];
};

// Get the donations docs based on the donorId
export const fetchDonationsByUserId = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw {
      status: 400,
      message: "Invalid user ID.",
    };
  }
  const donations = await Donation.find({ donorId: userId }).lean();
  return donations;
};

// Get all the donations each orpanage has recieved
export const fetchDonationsGroupedByOrphanages = async () => {
  const orphanDonations = await aggregateDonations("Orphan", "orphans");
  const campaignDonations = await aggregateDonations("Campaign", "campaigns");

  const donations = [...orphanDonations, ...campaignDonations].reduce(
    (acc, donation) => {
      const orphanageId = donation.orphanageId.toString();
      if (!acc[orphanageId]) {
        acc[orphanageId] = {
          orphanageId,
          totalAmount: 0,
          donations: [],
        };
      }
      acc[orphanageId].totalAmount += donation.amount;
      acc[orphanageId].donations.push(donation);
      return acc;
    },
    {}
  );

  return Object.values(donations);
};

// Get all the donations that an orpanage has recieved
export const fetchDonationsForOrphanage = async (orphanageId) => {
  if (!mongoose.Types.ObjectId.isValid(orphanageId)) {
    throw {
      status: 400,
      message: "Invalid orphanage ID.",
    };
  }

  const orphanDonations = await aggregateDonations(
    "Orphan",
    "orphans",
    orphanageId
  );
  const campaignDonations = await aggregateDonations(
    "Campaign",
    "campaigns",
    orphanageId
  );

  return [...orphanDonations, ...campaignDonations];
};

const aggregateDonations = async (
  donationTypeRef,
  collectionName,
  orphanageId = null
) => {
  const matchStage = {
    transactionStatus: "paid",
    "items.donationTypeRef": donationTypeRef,
  };

  if (orphanageId) {
    matchStage["recipient.orphanageId"] = mongoose.Types.ObjectId(orphanageId);
  }

  return await Donation.aggregate([
    { $match: matchStage },
    { $unwind: "$items" },
    { $match: { "items.donationTypeRef": donationTypeRef } },
    {
      $lookup: {
        from: collectionName,
        localField: "items.recipientId",
        foreignField: "_id",
        as: "recipient",
      },
    },
    { $unwind: "$recipient" },
    {
      $project: {
        orphanageId: "$recipient.orphanageId",
        donationType: "$items.donationType",
        amount: "$items.amount",
        recipientId: "$recipient._id",
        recipientName:
          donationTypeRef === "Orphan" ? "$recipient.name" : "$recipient.title",
        caseType: {
          $literal: donationTypeRef === "Orphan" ? "Orphan" : "Campaign",
        },
      },
    },
  ]);
};
