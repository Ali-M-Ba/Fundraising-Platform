import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, Types, model } = mongoose;

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
    password: {
      type: String,
      required: [true, "password is required."],
      minlength: [8, "Password must be at least 8 characters"],
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
    cart: [
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
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    // Hash password
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    return next();
  } catch (error) {
    return next(error);
  }
});

const User = model("User", userSchema);

export default User;
