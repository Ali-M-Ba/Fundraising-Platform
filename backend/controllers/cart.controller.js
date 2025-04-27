import mongoose from "mongoose";
import { handleError } from "../utils/error.handler.js";
import { handleResponse } from "../utils/response.handler.js";
import {
  validateAddingCartItem,
  validateUpdatingAmount,
} from "../validators/cart.validator.js";
import {
  findUserByAccessToken,
  syncCartWithValidItems,
  ensureDonationWithinLimit,
  extractValidCartItems,
} from "../utils/cart.utils.js";

export const getCartItems = async (req, res) => {
  try {
    const user = await findUserByAccessToken(req.cookies.accessToken);
    const { detailedCart } = await syncCartWithValidItems(user, req);

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
    let { recipientId, donationType, donationTypeRef, amount } = value;

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      throw {
        status: 400,
        message: "Invalid recipient ID.",
      };
    }

    const user = await findUserByAccessToken(req.cookies.accessToken);

    const { validCart, detailedCart } = await syncCartWithValidItems(user, req);

    if (validCart.length > process.env.MAX_CART_ITEMS) {
      throw { status: 400, message: "Cart limit exceeded." };
    }

    const validCartMap = new Map(
      validCart.map((item) => [item.recipientId.toString(), item])
    );
    const detailedCartMap = new Map(
      detailedCart.map((item) => [item.recipientId.toString(), item])
    );

    let updatedItem;
    const existingItem = validCartMap.get(recipientId);

    if (existingItem) {
      // Calculate the new total amount to ensure it does not exceed campaign limits
      const detailedItem = detailedCartMap.get(recipientId);
      const totalAmount = existingItem.amount + amount;
      const validAmount = ensureDonationWithinLimit(detailedItem, totalAmount);

      existingItem.amount = validAmount;
      updatedItem = existingItem;
    } else {
      // Create a new cart item if it does not already exist
      const { detailedCart } = await extractValidCartItems([
        { donationType, recipientId, donationTypeRef, amount },
      ]);
      const detailedItem = detailedCart[0];
      const validAmount = ensureDonationWithinLimit(detailedItem, amount);

      amount = validAmount;
      updatedItem = { donationType, recipientId, donationTypeRef, amount };
      validCart.push(updatedItem);
      validCartMap.set(recipientId, updatedItem);
    }

    // Persist updated cart
    // Convert the filtered Map back to an array and assign it.
    if (user) {
      user.cart = [...validCartMap.values()];
      await user.save();
    } else {
      req.session.cart = [...validCartMap.values()];
    }

    handleResponse(res, 201, "Item added successfully!", { item: updatedItem });
  } catch (error) {
    console.error("Error occurred adding item to cart: ", error);
    handleError(res, error);
  }
};

export const updateAmount = async (req, res) => {
  try {
    const { id: recipientId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      throw {
        status: 400,
        message: "Invalid recipient ID.",
      };
    }

    const { error, value } = validateUpdatingAmount(req.body);
    if (error) {
      const errors = error.details.map((error) => error.message);
      throw { status: 400, message: errors };
    }
    const { amount } = value;

    const user = await findUserByAccessToken(req.cookies.accessToken);

    const { validCart, detailedCart } = await syncCartWithValidItems(user, req);

    const existingItem = validCart.find(
      (item) => item.recipientId.toString() === recipientId
    );
    if (!existingItem) {
      return handleError(res, {
        status: 404,
        message: "Item not found in cart.",
      });
    }

    const detailedItem = detailedCart.find(
      (item) => item.recipientId.toString() === recipientId
    );

    const validAmount = ensureDonationWithinLimit(detailedItem, amount);
    existingItem.amount = validAmount;

    if (user) await user.save();
    const plainItem = existingItem.toObject
      ? existingItem.toObject()
      : existingItem;

    handleResponse(res, 200, "Item updated successfully!", {
      updatedItem: plainItem,
    });
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

    const user = await findUserByAccessToken(req.cookies.accessToken);
    const { validCart } = await syncCartWithValidItems(user, req);

    const removedItem =
      validCart.find((item) => item.recipientId.toString() === recipientId) ||
      {};
    const updatedCart = validCart.filter(
      (item) => item.recipientId.toString() !== recipientId
    );

    if (user) {
      user.cart = updatedCart;
      await user.save();
    } else {
      req.session.cart = updatedCart;
    }

    handleResponse(res, 200, "Item removed from cart successfully!", {
      cart: updatedCart,
      removedItem,
    });
  } catch (error) {
    console.error("Error occurred Clearing cart: ", error);
    handleError(res, error);
  }
};

export const clearCart = async (req, res) => {
  try {
    const clearedCart = [];

    const user = await findUserByAccessToken(req.cookies.accessToken);
    if (user) {
      user.cart = clearedCart;
      await user.save();
    } else {
      req.session.cart = clearedCart;
    }

    handleResponse(res, 200, "Cart cleared successfully!", {
      cart: clearedCart,
    });
  } catch (error) {
    console.error("Error occurred Clearing cart: ", error);
    handleError(res, error);
  }
};
