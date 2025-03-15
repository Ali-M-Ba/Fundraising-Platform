import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const campaignSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },
    orphanageId: {
      type: Types.ObjectId,
      ref: "Orphanage",
      required: [true, "Orphanage ID is required."],
    },
    targetAmount: {
      type: Number,
      required: [true, "Target amount is required."],
      min: [1, "Target amount must be at least 1."],
    },
    amountRaised: {
      type: Number,
      default: 0,
      min: [0, "Amount raised cannot be negative."],
    },
    status: {
      type: String,
      enum: ["active", "completed", "canceled"],
      default: "active",
      required: [true, "Status is required."],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required."],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required."],
      validate: {
        validator: function (value) {
          return this.startDate <= value;
        },
        message: "End date must be after the start date.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Campaign = model("Campaign", campaignSchema);

export default Campaign;
