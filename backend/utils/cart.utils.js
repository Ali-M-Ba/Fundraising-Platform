import { verifyToken } from "../middlewares/auth.middleware.js";
import User from "../models/User.model.js";
import Orphan from "../models/Orphan.model.js";
import Campaign from "../models/Campaign.model.js";

export const extractValidCartItems = async (cart) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    return { validCart: [], detailedCart: [] };
  }

  const { orphans: orphanDocs, campaigns: campaignDocs } =
    await getDonationRecipients(cart);

  const orphans = orphanDocs.map((orphan) => orphan.toObject());
  const campaigns = campaignDocs.map((campaign) => campaign.toObject());

  // Convert arrays into maps for quick lookup
  const orphanMap = new Map(
    orphans.map((orphan) => [orphan._id.toString(), orphan])
  );
  const campaignMap = new Map(
    campaigns.map((campaign) => [campaign._id.toString(), campaign])
  );

  const validCart = cart.filter((item) => {
    const strId = item.recipientId.toString();
    const match = orphanMap.get(strId) || campaignMap.get(strId);

    // Valid if orphan is not sponsored or campaign is active
    const isValid = match?.isSponsored === false || match?.status === "active";
    if (!isValid)
      console.warn("Removing invalid or non-existent item from cart:", item);

    if (isValid) item.amount = ensureDonationWithinLimit(match, item.amount);

    return isValid;
  });

  // Merge details
  const detailedCart = validCart.map((item) => ({
    // This approach doesn't work with js objects
    // ...item?.toObject?.(),
    // cause it returns 'undefined' when item.toObject() method not exists
    // it will speard ...undefined value
    ////////////////////////////////////
    // Check if the object is a mongodb doc or js plain object
    ...(item.toObject ? item.toObject() : item),
    details:
      orphanMap.get(item.recipientId.toString()) ||
      campaignMap.get(item.recipientId.toString()) ||
      null,
  }));

  return { validCart, detailedCart };
};

export const findUserByAccessToken = async (token) => {
  let userId;
  if (token) {
    try {
      const { userId: id } = verifyToken(token);
      userId = id;
    } catch (error) {
      console.error("Error verifying token: ", error);
      throw { status: 401, message: "Invalid token." };
    }
  }

  let user;
  if (userId) {
    user = await User.findById(userId).select("_id cart");
    if (!user) throw { status: 404, message: "User doesn't exist." };
  }

  return user;
};

const mergeAndClearGuestCart = (userCart, guestCart) => {
  let finalCart = userCart;

  if (guestCart.length > 0) {
    finalCart = combineCartItems(finalCart, guestCart);
    guestCart.length = 0; // Clear guest cart after merging
  }

  return finalCart;
};

const combineCartItems = (baseCart, additionalCart) => {
  const cartItemsMap = new Map(
    baseCart.map((item) => [item.recipientId.toString(), item])
  );

  additionalCart.forEach((guestItem) => {
    const recipientKey = guestItem.recipientId.toString();
    const existingItem = cartItemsMap.get(recipientKey);

    if (existingItem) {
      existingItem.amount += guestItem.amount;
    } else {
      baseCart.push(guestItem);
      cartItemsMap.set(recipientKey, guestItem);
    }
  });

  return baseCart;
};

export const syncCartWithValidItems = async (user, req) => {
  const resolvedCart = user
    ? mergeAndClearGuestCart(user.cart, req.session.cart)
    : req.session.cart;

  const { validCart, detailedCart } = await extractValidCartItems(resolvedCart);

  if (resolvedCart.length !== validCart.length) {
    if (user) {
      user.cart = validCart;
      await user.save();
    }
    req.session.cart = validCart;
  }

  return { validCart, detailedCart };
};

export const ensureDonationWithinLimit = (donationItem, donationAmount) => {
  // Extract details depending on the shape of donationItem
  const isCampaign =
    donationItem.donationType === "campaign" ||
    donationItem.status === "active";
  const details = donationItem.details || donationItem;

  if (
    isCampaign &&
    details.targetAmount != null &&
    details.amountRaised != null
  ) {
    const remainingAmount = details.targetAmount - details.amountRaised;
    return donationAmount > remainingAmount ? remainingAmount : donationAmount;
  }

  // Default
  return donationAmount;
};

export const getDonationRecipients = async (cart) => {
  const orphanIds = [];
  const campaignIds = [];

  // Separate recipient IDs based on donationType
  for (const item of cart) {
    if (item.donationType === "orphan") {
      orphanIds.push(item.recipientId);
    } else if (item.donationType === "campaign") {
      campaignIds.push(item.recipientId);
    }
  }

  // Fetch data in parallel
  const [orphans, campaigns] = await Promise.all([
    Orphan.find({ _id: { $in: orphanIds } }).select(
      "_id orphanageId name isSponsored photos"
    ),
    Campaign.find({ _id: { $in: campaignIds } }).select(
      "_id orphanageId title status targetAmount amountRaised images"
    ),
  ]);

  return { orphans, campaigns };
};
