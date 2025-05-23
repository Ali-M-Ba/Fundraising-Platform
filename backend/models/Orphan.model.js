import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const orphanSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required."],
      min: [0, "Age cannot be negative."],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: [true, "Gender is required."],
    },
    healthStatus: {
      type: String,
      enum: ["Healthy", "Minor Health Issues", "Disabled"],
      required: [true, "Health status is required."],
    },
    orphanageId: {
      type: Types.ObjectId,
      ref: "Orphanage",
      required: [true, "Orphanage ID is required."],
    },
    location: {
      city: {
        type: String,
        required: [true, "City name is required."],
      },
      country: {
        type: String,
        required: [true, "Country name is required."],
      },
    },
    needs: [
      {
        category: {
          type: String,
          required: [true, "Category is required."],
          trim: true,
        },
        amountNeeded: {
          type: Number,
          required: [true, "Amount needed is required."],
          min: [0, "Amount needed cannot be negative."],
        },
        amountReceived: {
          type: Number,
          default: 0,
          min: [0, "Amount received cannot be negative."],
        },
      },
    ],
    isSponsored: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      trim: true,
    },
    photos: {
      type: [String],
    }, 
  },
  {
    timestamps: true,
  }
);

const Orphan = model("Orphan", orphanSchema);

export default Orphan;
