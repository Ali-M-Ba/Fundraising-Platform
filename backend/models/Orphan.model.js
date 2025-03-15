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
    orphanageId: {
      type: Types.ObjectId,
      ref: "Orphanage",
      required: [true, "Orphanage ID is required."],
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
    bio: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/.test(v);
        },
        message: "Invalid image URL format.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Orphan = model("Orphan", orphanSchema);

export default Orphan;
