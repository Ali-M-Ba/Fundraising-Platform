import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const donationSchema = new Schema(
  {
    donorId: {
      type: Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        donationType: {
          type: String,
          enum: ["campaign", "orphan"],
          required: true,
        },
        recipientId: {
          type: Types.ObjectId,
          required: [true, "Recipient ID is required."],
          refPath: "donationTypeRef",
        },
        donationTypeRef: {
          type: String,
          required: true,
          enum: ["Campaign", "Orphan"],
        },
        amount: {
          type: Number,
          required: [true, "Donation amount is required."],
          min: [1, "Donation amount must be at least 1."],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Donation amount is required."],
      min: [1, "Donation amount must be at least 1."],
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "bank_transfer"],
      required: [true, "Payment method is required."],
    },
    stripeSessionId: {
      type: String,
      unique: true,
      required: true,
    },
    transactionStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      required: [true, "Transaction status is required."],
    },
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);

const Donation = model("Donation", donationSchema);

export default Donation;
