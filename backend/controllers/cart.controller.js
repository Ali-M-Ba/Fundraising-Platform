import mongoose from "mongoose";
import Orphan from "../models/Orphan.model.js";
import Campaign from "../models/Campaign.model.js";
import { handleError } from "../utils/error.handler.js";
import { handleResponse } from "../utils/response.handler.js";
import {
  validateAddingCartItem,
  validateUpdatingAmount,
} from "../validators/cart.validator.js";
import {
  getUserUsingToken,
  resolveCart,
  validateDonationAmount,
  getModel,
  getDocument,
} from "../utils/cart.utils.js";

export const getCartItems = async (req, res) => {
  try {
    const user = await getUserUsingToken(req.cookies.accessToken);
    const cart = user
      ? resolveCart(user.cart, req.session.cart)
      : req.session.cart;

    if (cart.length === 0)
      return handleResponse(res, 200, "Cart is empty.", []);

    if (user) user.save();

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
        .select("_id name isSponsored photo")
        .lean(),
      Campaign.find({ _id: { $in: campaignIds } })
        .select("_id title targetAmount amountRaised")
        .lean(),
    ]);

    // Convert arrays into maps for quick lookup
    const orphanMap = new Map(
      orphans.map((orphan) => [orphan._id.toString(), orphan])
    );
    const campaignMap = new Map(
      campaigns.map((campaign) => [campaign._id.toString(), campaign])
    );

    // Merge details into userCart
    const detailedCart = cart.map((item) => ({
      // Check if the object is a mongodb doc or js plain object
      ...(item.toObject ? item.toObject() : item),
      details:
        orphanMap.get(item.recipientId.toString()) ||
        campaignMap.get(item.recipientId.toString()) ||
        null,
    }));

    handleResponse(res, 200, "Cart Items retrieved successfully!", {
      detailedCart,
    });
  } catch (error) {
    console.error("Error fetching cart details:", error);
    handleError(res, error);
  }
};

export const addToCart = async (req, res) => {
  try {
    const { error, value } = validateAddingCartItem(req.body);
    if (error) {
      const errors = error.details.map((error) => error.message);
      throw { status: 400, message: errors };
    }
    const { recipientId, donationType, donationTypeRef, amount } = value;

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      throw {
        status: 400,
        message: "Invalid recipient ID.",
      };
    }

    // Determine the appropriate model ('Campaign' or 'Orphan') based on donation type
    const model = getModel(donationType);

    // Fetch the corresponding document from the database
    const document = await getDocument(model, recipientId);

    const user = await getUserUsingToken(req.cookies.accessToken);

    // Determine the current cart:
    // - If the user is logged in, use their saved cart.
    // - Otherwise, use the cart stored in the session.
    const cart = user
      ? resolveCart(user.cart, req.session.cart)
      : req.session.cart;

    // Convert the cart from an array to a Map for efficient lookup and modification.
    const cartMap = new Map(
      cart.map((item) => [item.recipientId.toString(), item])
    );
    let updatedItem;
    const existingItem = cartMap.get(recipientId);

    if (existingItem) {
      // Calculate the new total amount to ensure it does not exceed campaign limits
      const totalAmount = existingItem.amount + amount;
      validateDonationAmount(document, totalAmount, donationType);

      existingItem.amount += amount;
      updatedItem = existingItem;
    } else {
      // Create a new cart item if it does not already exist
      updatedItem = { donationType, recipientId, donationTypeRef, amount };
      cart.push(updatedItem);
      cartMap.set(recipientId, updatedItem);
    }

    if (user) await user.save();

    handleResponse(res, 201, "Item added successfully!", { item: updatedItem });
  } catch (error) {
    console.error("Error occurred adding item to cart: ", error);
    handleError(res, error);
  }
};

export const updateAmount = async (req, res) => {
  try {
    const { error, value } = validateUpdatingAmount(req.body);
    if (error) {
      const errors = error.details.map((error) => error.message);
      throw { status: 400, message: errors };
    }
    const { recipientId, donationType, amount } = value;

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      throw {
        status: 400,
        message: "Invalid recipient ID.",
      };
    }

    // Determine the appropriate model ('Campaign' or 'Orphan') based on donation type
    const model = getModel(donationType);

    // Fetch the corresponding document from the database
    const document = await getDocument(model, recipientId);

    const user = await getUserUsingToken(req.cookies.accessToken);

    // Determine the current cart:
    // - If the user is logged in, use their saved cart.
    // - Otherwise, use the cart stored in the session.
    const cart = user
      ? resolveCart(user.cart, req.session.cart)
      : req.session.cart;

    // Convert the cart from an array to a Map for efficient lookup and modification.
    const cartMap = new Map(
      cart.map((item) => [item.recipientId.toString(), item])
    );

    // We don't want update item doesn't exist.
    if (!cartMap.has(recipientId)) {
      return handleError(res, {
        status: 404,
        message: "Item not found in cart.",
      });
    }

    const existingItem = cartMap.get(recipientId);
    validateDonationAmount(document, amount, donationType);
    existingItem.amount = amount;

    if (user) await user.save();
    // const plainItem = user ? existingItem.toObject() : existingItem;

    handleResponse(
      res,
      200,
      "Item updated successfully!",
      user ? existingItem.toObject() : existingItem
    );
  } catch (error) {
    console.error("Error occurred updating amount: ", error);
    handleError(res, error);
  }
};

export const removeItem = async (req, res) => {
  try {
    const { id: recipientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      throw {
        status: 400,
        message: "Invalid recipient ID.",
      };
    }

    let cart;
    const user = await getUserUsingToken(req.cookies.accessToken);
    if (user) {
      resolveCart(user.cart, req.session.cart);
      cart = user.cart = user.cart.filter(
        (item) => item.recipientId.toString() !== recipientId
      );
      await user.save();
    } else {
      cart = req.session.cart = req.session.cart.filter(
        (item) => item.recipientId !== recipientId
      );
    }

    handleResponse(res, 200, "Item removed from cart successfully!", { cart });
  } catch (error) {
    console.error("Error occurred Clearing cart: ", error);
    handleError(res, error);
  }
};

export const clearCart = async (req, res) => {
  try {
    let cart;
    const user = await getUserUsingToken(req.cookies.accessToken);
    if (user) {
      resolveCart(user.cart, req.session.cart);
      cart = user.cart = [];
      await user.save();
    } else {
      cart = req.session.cart = [];
    }

    handleResponse(res, 200, "Cart cleared successfully!", cart);
  } catch (error) {
    console.error("Error occurred Clearing cart: ", error);
    handleError(res, error);
  }
};
