const {
  checkout,
  getKey,
  paymentVerification,
} = require("../controllers/payment");

const express = require("express");
const { verifyToken, checkRole } = require("../middleware/authentication");
const router = express.Router();

router.post("/checkout", checkout);

router.post("/paymentverification", verifyToken('Student'), checkRole(['Student']), paymentVerification);
router.route("/getKey").get(getKey);
 


module.exports = router;
