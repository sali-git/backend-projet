const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: String },
    to: { type: String },
    amount: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT", "TRANSFER_SENT", "TRANSFER_RECEIVED"],
      required: true
    },
    status: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
    description: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
