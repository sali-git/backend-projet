const Transaction = require("../models/transactionModel");

module.exports.getTransactions = async (req, res) => {
    try {
        const list = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
