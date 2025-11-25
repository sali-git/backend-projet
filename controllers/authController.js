const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  try {
    // Accepter à la fois fullName (camelCase) et fullname (lowercase)
    const fullName = req.body.fullName || req.body.fullname;
    const { email, password, currency } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fullName, email et password sont requis" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email déjà utilisé" });

    const user = await User.create({ fullName, email, password });

    const wallet = await Wallet.create({
      userId: user._id,
      currency: currency || "XOF"
    });

    res.status(201).json({
      message: "Utilisateur créé",
      user: { id: user._id, fullName: user.fullName, email: user.email },
      wallet: { id: wallet._id, balance: wallet.balance, currency: wallet.currency }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
