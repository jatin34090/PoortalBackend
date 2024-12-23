const mongoose = require('mongoose');

const batchRelatedDetailsSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    preferred_batch: { type: String, required: true },
    subject_combination: { type: String, required: true },
    session_start_date: { type: Date, required: true },
});

const BatchRelatedDetails = mongoose.model('BatchRelatedDetails', batchRelatedDetailsSchema);
module.exports = BatchRelatedDetails;
