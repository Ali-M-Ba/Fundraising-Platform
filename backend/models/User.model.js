import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
    },
    passwordHash: {
      type: String,
      required: [true, "password is required."],
      minlength: [8, "Password must be at least 8 characters"]
    },
    role: {
      type: String,
      enum: ["donor", "admin", "orphanage"],
      default: "donor",
    },
    phone: {
      type: String,
      required: [true, "Phone is required."],
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number."],
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;