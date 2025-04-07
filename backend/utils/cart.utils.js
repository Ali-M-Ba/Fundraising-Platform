import { verifyToken } from "../middlewares/auth.middleware.js";
import User from "../models/User.model.js";
import Orphan from "../models/Orphan.model.js";
import Campaign from "../models/Campaign.model.js";


export const getUserUsingToken = async (accessToken) => {
  let userId;
  if (accessToken) {
    try {
      const { userId: id } = verifyToken(accessToken);
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

export const resolveCart = (userStoredCart, guestCart) => {
  let finalCart = userStoredCart;

  if (guestCart.length > 0) {
    finalCart = mergeGuestCartIntoUserCart(finalCart, guestCart);
    guestCart.length = 0; // Clear guest cart after merging
  }

  return finalCart;
};

const mergeGuestCartIntoUserCart = (userCart, guestCart) => {
  const cartItemsMap = new Map(
    userCart.map((item) => [item.recipientId.toString(), item])
  );

  guestCart.forEach((guestItem) => {
    const recipientKey = guestItem.recipientId.toString();
    const existingItem = cartItemsMap.get(recipientKey);

    if (existingItem) {
      existingItem.amount += guestItem.amount;
    } else {
      userCart.push(guestItem);
      cartItemsMap.set(recipientKey, guestItem);
    }
  });

  return userCart;
};

export const validateDonationAmount = (document, amount, donationType) => {
  if (donationType === "campaign") {
    const remainAmount = document.targetAmount - document.amountRaised;
    if (amount > remainAmount) {
      throw {
        status: 400,
        message: `We apologize, the maximum donation amount is ${remainAmount} dollars.`,
      };
    }
  }
};

export const getModel = (donationType) => {
  const model =
    donationType === "orphan"
      ? Orphan
      : donationType === "campaign"
      ? Campaign
      : null;
  if (!model) {
    throw {
      status: 400,
      message: `Invalid donation type: ${donationType}. Valid types are 'orphan' and 'campaign'.`,
    };
  }

  return model;
};

export const getDocument = async (model, recipientId) => {
  const document = await model.findById(recipientId);
  if (!document) {
    throw {
      status: 404,
      message: "Document doesn't exist.",
    };
  }

  return document;
};
