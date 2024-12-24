const instance = require("../utils/razorpay");
const crypto = require("crypto");


 const checkout = async (req, res) => {
    console.log("checkout");
    try {

        const options = {
            amount: 50000,  // amount in the smallest currency unit
            currency: "INR",
            // receipt: "order_rcptid_11"
        };
        const order = await instance.orders.create(options);

        console.log(order);

        res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.log(error);
    }
}

 const paymentVerification = async (req, res) => {
    try {

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
// save in database


res.redirect(`http://localhost:3000/success?reference=${razorpay_payment_id}`);

            return res.status(200).json({
                success: true,
            });
        } else {
            return res.status(400).json({
                success: false,
            });
        }

       

    } catch (error) {
        console.log(error);
    }
}

 const getKey = async (req, res) => {
    try {
        res.status(200).json({
            key: process.env.RAZORPAY_KEY,
        });
    } catch (error) {
        console.log(error);
    }
}


module.exports = { checkout, paymentVerification, getKey };
