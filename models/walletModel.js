const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "XOF", uppercase: true },
    walletNumber: { type: String, unique: true }
  },
  { timestamps: true }
);

walletSchema.pre("save", function (next) {
  if (!this.walletNumber) {
    this.walletNumber = `WAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model("Wallet", walletSchema);
