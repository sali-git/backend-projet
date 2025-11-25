const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

// GET WALLET
module.exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet introuvable" });
    }

    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ensurePositiveAmount = (amount) => {
  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    throw new Error("Le montant doit être un nombre positif");
  }
};

// ADD MONEY
module.exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    ensurePositiveAmount(amount);

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet introuvable" });
    }

    wallet.balance += amount;
    await wallet.save();

    await Transaction.create({
      userId: req.user.id,
      amount,
      type: "CREDIT",
      description: "Dépôt manuel"
    });

    res.status(200).json(wallet);
  } catch (error) {
    const status = error.message.includes("montant") ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

// REMOVE MONEY
module.exports.removeMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    ensurePositiveAmount(amount);

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet introuvable" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Solde insuffisant" });
    }

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
      userId: req.user.id,
      amount,
      type: "DEBIT",
      description: "Retrait manuel"
    });

    res.status(200).json(wallet);
  } catch (error) {
    const status = error.message.includes("montant") ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

// TRANSFER MONEY
module.exports.transfer = async (req, res) => {
  try {
    const { receiverEmail, amount } = req.body;
    ensurePositiveAmount(amount);

    if (!receiverEmail) {
      return res.status(400).json({ message: "receiverEmail requis" });
    }

    // 1️⃣ Vérifier l’utilisateur destinataire
    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) {
      return res.status(404).json({ message: "Destinataire non trouvé" });
    }

    if (receiver._id.equals(req.user.id)) {
      return res.status(400).json({ message: "Impossible d'envoyer vers soi-même" });
    }

    // 2️⃣ Récupérer les wallets
    const senderWallet = await Wallet.findOne({ userId: req.user.id });
    const receiverWallet = await Wallet.findOne({ userId: receiver._id });

    if (!senderWallet || !receiverWallet) {
      return res.status(404).json({ message: "Wallet manquant pour l'une des parties" });
    }

    // 3️⃣ Vérifier solde de l'envoyeur
    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: "Solde insuffisant" });
    }

    // 4️⃣ Effectuer la transaction
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save();
    await receiverWallet.save();

    // 5️⃣ Enregistrer les transactions
    await Transaction.create({
      userId: req.user.id,
      amount,
      type: "TRANSFER_SENT",
      to: receiverEmail,
      description: `Transfert vers ${receiverEmail}`
    });

    await Transaction.create({
      userId: receiver._id,
      amount,
      type: "TRANSFER_RECEIVED",
      from: req.user.email,
      description: `Transfert reçu de ${req.user.email}`
    });

    res.status(200).json({
      message: "Transfert effectué avec succès",
      senderBalance: senderWallet.balance
    });
  } catch (error) {
    const status = error.message.includes("montant") ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};
