const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { getWallet, addMoney, removeMoney, transfer } = require("../controllers/walletController");

router.get("/", auth, getWallet);
router.post("/add", auth, addMoney);
router.post("/remove", auth, removeMoney);
router.post("/transfer", auth, transfer);   // <--- ajouté

module.exports = router;
