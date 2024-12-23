const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    transaction_id: { type: String, required: true },
    payment_status: { type: String, enum: ['Success', 'Failed'], required: true },
    payment_method: { type: String, required: true },
    amount: { type: Number, required: true },
    payment_date: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
