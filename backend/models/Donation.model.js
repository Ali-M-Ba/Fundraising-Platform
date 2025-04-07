import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const donationSchema = new Schema(
  {
    donorId: {
      type: Types.ObjectId,
      ref: "User",
    },
    recipientId: {
      type: Types.ObjectId,
      required: [true, "Recipient ID is required."],
      refPath: "donationTypeRef", // Dynamically references "Campaign" or "Orphan"
    },
    donationTypeRef: {
      type: String,
      required: true,
      enum: ["Campaign", "Orphan"], // Ensures valid model references
    },
    amount: {
      type: Number,
      required: [true, "Donation amount is required."],
      min: [1, "Donation amount must be at least 1."],
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer"],
      required: [true, "Payment method is required."],
    },
    transactionStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
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
