import { stripe } from "../config/stripe.js";
import { handleResponse } from "../utils/response.handler.js";
import { handleError } from "../utils/error.handler.js";
import Donation from "../models/Donation.model.js";
import {
  findUserByAccessToken,
  syncCartWithValidItems,
} from "../utils/cart.utils.js";
import {
  calculateDonationSummary,
  generateCheckoutSession,
  getPaymentMethod,
  updateItemsData,
  fetchAllDonations,
  fetchDonationsByUserId,
  fetchDonationsForOrphanage,
  fetchDonationsGroupedByOrphanages,
} from "../utils/donation.utils.js";

export const getAllDonations = async (req, res) => {
  try {
    const donations = await fetchAllDonations();

    handleResponse(res, 200, "Donations retrieved successfully!", {
      donations,
    });
  } catch (error) {
    console.error("Error occurred fetching the donations: ", error);
    handleError(res, error);
  }
};

export const getAllDonationsByUserId = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const donations = await fetchDonationsByUserId(userId);

    handleResponse(res, 200, "Donations retrieved successfully!", {
      donations,
    });
  } catch (error) {
    console.error("Error occurred fetching the donations: ", error);
    handleError(res, error);
  }
};

export const getAllDonationsGroupedByOrphanages = async (req, res) => {
  try {
    const donations = await fetchDonationsGroupedByOrphanages();

    handleResponse(res, 200, "Donations retrieved successfully!", {
      donations,
    });
  } catch (error) {
    console.error("Error occurred fetching the donations: ", error);
    handleError(res, error);
  }
};

export const getAllDonationsForOrphanage = async (req, res) => {
  try {
    const { id: orphanageId } = req.params;
    const donations = await fetchDonationsForOrphanage(orphanageId);

    handleResponse(res, 200, "Donations retrieved successfully!", {
      donations,
    });
  } catch (error) {
    console.error("Error occurred fetching the donations: ", error);
    handleError(res, error);
  }
};

export const processDonation = async (req, res) => {
  try {
    // const { paymentMethod } = req.body;
    const user = await findUserByAccessToken(req.cookies.accessToken);
    const { validCart, detailedCart } = await syncCartWithValidItems(user, req);

    console.log(detailedCart);
    const lineItems = calculateDonationSummary(detailedCart);

    const session = await generateCheckoutSession(
      user?._id.toString(),
      lineItems,
      validCart
    );

    // res.redirect(303, session.url);
    handleResponse(res, 200, "Donation session created successfully!", {
      sessionId: session.id,
      sessionURL: session.url,
    });
  } catch (error) {
    console.log(error.message);
    handleError(res, error);
  }
};

export const handleSuccessDonation = async (req, res) => {
  try {
    const { session_id: sessionId } = req.query;
    if (!sessionId) {
      throw {
        status: 400,
        message: "Session ID is required",
      };
    }

    // Check if donation already processed
    const existingDonation = await Donation.findOne({
      stripeSessionId: sessionId,
    });
    if (existingDonation) {
      return handleResponse(res, 200, "Donation already processed", {
        donation: existingDonation,
      });
    }

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      throw { status: 404, message: "Session not found" };
    }

    // amount_total is in cents
    const { id, payment_status, amount_total, currency } = session;
    const { type } = await getPaymentMethod(session);

    if (session.payment_status !== "paid") {
      throw {
        status: 400,
        message: "Payment not completed",
      };
    }

    const { userId, itemsData } = session.metadata;
    if (!itemsData) {
      throw {
        status: 400,
        message: "Missing required metadata",
      };
    }

    let parsedItems;
    try {
      parsedItems = JSON.parse(itemsData);
    } catch (error) {
      console.error("Error parsing items data from session metadata: ", error);
      throw {
        status: 400,
        message: "Invalid items metadata",
      };
    }

    await updateItemsData(parsedItems);

    const donation = new Donation({
      donorId: userId,
      items: parsedItems.map((item) => item),
      totalAmount: amount_total / 100,
      paymentMethod: type,
      stripeSessionId: id,
      transactionStatus: payment_status,
    });

    await donation.save();

    handleResponse(res, 200, "Successful donation!", { donation });
  } catch (error) {
    console.log("Error occurred handling success donation: ", error);
    handleError(res, error);
  }
};
