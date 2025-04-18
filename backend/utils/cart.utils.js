import { verifyToken } from "../middlewares/auth.middleware.js";
import User from "../models/User.model.js";
import Orphan from "../models/Orphan.model.js";
import Campaign from "../models/Campaign.model.js";

export const extractValidCartItems = async (cart) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    return { validCart: [], detailedCart: [] };
  }

  const orphanIds = [];
  const campaignIds = [];

  // Separate orphan and campaign recipientIds
  cart.forEach((item) => {
    if (item.donationType === "orphan") {
      orphanIds.push(item.recipientId);
    } else if (item.donationType === "campaign") {
      campaignIds.push(item.recipientId);
    }
  });

  // Fetch all orphan and campaign documents in parallel
  const [orphans, campaigns] = await Promise.all([
    Orphan.find({ _id: { $in: orphanIds } })
      .select("_id name isSponsored photos")
      .lean(),
    Campaign.find({ _id: { $in: campaignIds } })
      .select("_id title status targetAmount amountRaised images")
      .lean(),
  ]);

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

export const syncCartWithValidItems = async (user, guestSessionCart) => {
  const resolvedCart = user
    ? mergeAndClearGuestCart(user.cart, guestSessionCart)
    : guestSessionCart;

  const { validCart, detailedCart } = await getCartDetails(resolvedCart);

  if (resolvedCart.length !== validCart.length) {
    if (user) {
      user.cart = validCart;
      await user.save();
    }
    guestSessionCart = validCart;
  }

  return { validCart, detailedCart };
};

export const ensureDonationWithinLimit = (donationItem, donationAmount) => {
  if (donationItem.donationType === "campaign") {
    const remainAmount = donationItem.targetAmount - donationItem.amountRaised;
    if (donationAmount > remainAmount) {
      throw {
        status: 400,
        message: `We apologize, the maximum donation amount is ${remainAmount} dollars.`,
      };
    }
  }
};
