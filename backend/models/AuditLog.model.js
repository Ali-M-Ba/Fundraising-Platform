import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      required: [true, "Action type is required."],
      trim: true,
    },
    details: {
      type: String,
      required: [true, "Details are required."],
      trim: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);

const AuditLog = model("AuditLog", auditLogSchema);

export default AuditLog;
