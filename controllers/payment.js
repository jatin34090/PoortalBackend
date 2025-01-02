const instance = require("../utils/razorpay");
const crypto = require("crypto");
const Payment = require("../models/form/Payment");
const processHTMLAndGenerateAdmitCards = require("../utils/AdmitCardGenerator");
const Students = require("../models/Student");
const BatchRelatedDetails = require("../models/form/BatchRelatedDetails");
const BasicDetails = require("../models/form/BasicDetails");

require("dotenv").config();


const checkout = async (req, res) => {
    try {

        const options = {
            amount: 50000,  // amount in the smallest currency unit
            currency: "INR",
            // receipt: "order_rcptid_11"
        };
        const order = await instance.orders.create(options);

        console.log("order", order);

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
        console.log("req.body of paymentVerification", req);
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;


        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        console.log("req.body", req.body);


        console.log("rezorpay_signature", razorpay_signature);
        console.log("razorpay_payment_id", razorpay_payment_id);
        console.log("razorpay_order_id", razorpay_order_id);
        console.log("sign", sign);

        // Uncomment if Razorpay signature verification is required
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");
        console.log("ExpectedSign", expectedSign);
        if (razorpay_signature === expectedSign) {
            const payment = await Payment.create({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                payment_date: new Date(),
            });

            console.log("Payment created:", payment);
            return res.redirect(`http://localhost:5173/payment/success/${payment._id}`);

        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid signature",
            })
        }
    } catch (error) {
        console.error("Error in payment verification:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const generateAdmitCard = async (req, res) => {
    try {
        console.log("Generate Admit Card");
        const student = await Students.findById(req.user._id);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        const basicDetails = await BasicDetails.findOne({ student_id: req.user._id });
        if (!basicDetails) {
            return res.status(404).json({ success: false, message: "Basic Details not found" });
        }
        const batchDetails = await BatchRelatedDetails.findOne({ student_id: req.user._id });
        if (!batchDetails) {
            return res.status(404).json({ success: false, message: "Batch Details not found" });
        }
        console.log("basicDetails", basicDetails);
        console.log("batchDetails", batchDetails);
        // Allocate a new StudentsId
        const newStudentsId = await Students.allocateStudentsId(batchDetails.classForAdmission);
        console.log("Allocated StudentsId:", newStudentsId);
        // Update the student document
        student.StudentsId = newStudentsId;
        const data = {
            name: student.name,
            class: batchDetails.classForAdmission,
            dob: basicDetails.dob,
            gender: basicDetails.gender,
            stream: batchDetails.subjectCombination,
            studentId: student.StudentsId,
        }
        // Generate admit card
        const admitCard = await processHTMLAndGenerateAdmitCards(data);
        console.log("Admit card generated:", admitCard);
        student.admitCard = admitCard;
        const updatedStudent = await student.save();
        console.log("Updated student:", updatedStudent);
        // Send success response
        return res.status(200).json({
            success: true,
            message: "Admit Card Generated Successfully",
        });

    } catch (error) {
        console.error("Error in payment verification:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getKey = async (req, res) => {
    try {
        console.log("process.env.RAZORPAY_KEY", process.env.RAZORPAY_KEY_ID);
        res.status(200).json({
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.log(error);
    }
}


const getAllPaymentDetails = async (req, res) => {
    try {
        const addDetails = await Payment.find({});
        console.log("addDetails", addDetails);
        res.status(200).json({ addDetails });

    } catch (error) {
        res.status(400).json({ "error": error });
    }
}


module.exports = { checkout, paymentVerification, getKey, getAllPaymentDetails, generateAdmitCard };
