const mongoose = require('mongoose');

// Define Students Schema
const studentsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  StudentsId: { type: String }, // Unique constraint for StudentsId
  email: { type: String, required: true, unique: true },
  admitCard: { type: String },
  result: { type: String },
  paymentId: { type: String },
  role: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: String },
});

// Static Method to Allocate StudentsId
studentsSchema.statics.allocateStudentsId = async function (classForAdmission) {
  let currentYear = new Date().getFullYear();
  const currentmonth = new Date().getMonth();

  if(currentmonth>9 && currentmonth<12){
    currentYear=currentYear+1
  }
  // Count how many students are in the given class using BatchRelatedDetails
  const BatchRelatedDetails = mongoose.model('BatchRelatedDetails');
  const classStudentCount = await BatchRelatedDetails.countDocuments({ classForAdmission });

  // Increment the count for the new student
  const studentNumber = String(classStudentCount + 1).padStart(3, '0'); // 3-digit padding

  // Return the formatted StudentsId
  return `${currentYear}${classForAdmission}${studentNumber}`;
};

// Ensure the unique index for StudentsId
// studentsSchema.index({ StudentsId: 1 });
// studentsSchema.drop('StudentsId_1');
studentsSchema.index({ StudentsId: 1 }, { unique: true, partialFilterExpression: { StudentsId: { $ne: null } } });


// Create and Export the Students Model
const Students = mongoose.model('Students', studentsSchema);
module.exports = Students;
