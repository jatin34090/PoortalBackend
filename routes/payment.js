const {
  checkout,
  getKey,
  paymentVerification,
} = require("../controllers/payment");

const express = require("express");
const { verifyToken, checkRole } = require("../middleware/authentication");
const router = express.Router();

router.post("/checkout", checkout);

router.post("/paymentverification",  paymentVerification);
router.get("/getKey", getKey);
 


module.exports = router;
