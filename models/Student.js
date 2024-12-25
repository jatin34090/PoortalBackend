const { v4: uuidv4 } = require('uuid'); // Import UUID generator
const mongoose = require("mongoose");

const studentsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  StudentsId: {
    type: String,
    default: uuidv4, // Automatically assign a unique UUID
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  phone:{
    type: String,
    required: true
  },
  admitCard: {
    typr: String,
  },
  result:{
    type: String
  },
  password: {
    type: String,
    required: true,
  },
  resetToken:{
    type: String
  },
resetTokenExpiry:{
  type: String
}
});

const Students = mongoose.model("Students", studentsSchema);
module.exports = Students;
