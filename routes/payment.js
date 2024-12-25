const {
  checkout,
  getKey,
  paymentVerification,
} = require("../controllers/payment");

const express = require("express");
const router = express.Router();

router.post("/checkout", checkout);

router.post("/paymentverification", paymentVerification);
router.route("/getKey").get(getKey);
 


module.exports = router;
