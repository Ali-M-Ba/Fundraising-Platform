import mongoose from "mongoose";

const { Schema, Types, model } = mongoose;

const orphanageSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required."],
      trim: true,
    },
    adminId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Admin ID is required."],
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
    contact: {
      email: {
        type: String,
        required: [true, "Email is required."],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
      },
      phone: {
        type: String,
        required: [true, "Phone is required."],
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number."],
      },
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },
  },
  { timestamps: true }
);

const Orphanage = model("Orphanage", orphanageSchema);

export default Orphanage;
