import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  currentLevel: {
    type: Number,
    default: 0,
  },
  approvals: [
    {
      role: String,
      status: {
        type: String,
        enum: ["pending", "approved", "skipped"],
        default: "pending",
      },
      timestamp: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ApprovalRequest", approvalSchema);
