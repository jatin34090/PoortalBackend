// Import the Student model (assuming you've defined it already in your Mongoose schema)
const Students = require("../models/Student");
const mongoose = require("mongoose");
const BasicDetails = require("../models/form/BasicDetails");
const BatchRelatedDetails = require("../models/form/BatchRelatedDetails");
const EducationalDetails = require("../models/form/EducationalDetails");
const Payment = require("../models/form/Payment");
const FamilyDetails = require("../models/form/FamilyDetails");
const { reservationsUrl } = require("twilio/lib/jwt/taskrouter/util");
const { uploadOnCloudinary } = require("../utils/cloudinary");



const uploadStudentResult = async (req, res) => {
  try {
    const { result, studentId } = req.body;
    uploadOnCloudinary(result);
    const student = await Students.findOne({ _id: req.user.id });
    student.result = result;
    await student.save();
    res.status(200).json({ message: "Result added successfully" });
  } catch (error) {
    console.log("error", error);
  }
}




// Function to get all students
const getStudents = async (req, res) => {
  try {
    const allStudents = await Students.find().select("-password");
    if (allStudents.length === 0) {
      res.status(400).json({ message: "No students found" });
    }
    res.status(200).json(allStudents);
  } catch (error) {
    console.log("error", error);
  }
}

const getStudentsById = async (req, res) => {
  try {
    const student = await Students.findOne({ _id: req.user.id }).select("-password -__v -created_at -updated_at -_id -StudentsId -resetToken -resetTokenExpiry");
    console.log("student", student);
    if (student.length === 0) {
      res.status(400).json({ message: "No students found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.log("error", error);
  }
}



// Function to add a new student
const addStudents = async (req, res) => {
  const {
    name,
    StudentsId,
    email,
    role = "Student",
    formNo,
    password,
  } = req.body;

  const existingStudent = await Students.findOne({ email });
  if (existingStudent) {
    return res.status(400).json("Student already exists");
  }
  try {
    const newStudent = new Students({
      name,
      StudentsId,
      email,
      role,
      formNo,
      password
    });
    const result = await newStudent.save();
    return res.status(200).json({ student: { name, email, role, formNo } });
  } catch (error) {
    res.status(500).json("Error adding student: " + error);
  }
};

// Function to edit an existing student
const editStudent = async (req, res) => {
  const student_id = req.params.student_id || req.user.id;

  console.log("req.body form payment update", req.body);

  const { name, email, role, password, payment_id } = req.body;
  const student = await Students.findById(student_id);

  if (!student) {
    return res.status(400).send("Student not found");
  }

  student.name = name ? name : student.name;
  student.email = email ? email : student.email;
  student.role = role ? role : student.role;
  student.password = password ? password : student.password;
  student.paymentId = payment_id ? payment_id : student.paymentId;

  const updateStudent = await student.save();

  res.send(updateStudent);
}

// Function to delete a student
// const deleteStudent = async (req, res) => {
//   const {student_id} = req.params;
//   console.log("student_id", student_id)
//   try {
//     const deletedStudent = await Students.findByIdAndDelete(student_id);
//     if (!deletedStudent) {
//       res.status(404).json("Student not found");
//     }
//      res.status(200).json("Student deleted successfully");
//   } catch (error) {
//     res.status(500).json("Error deleting student: " + error.message);
//   }
// };






const deleteStudent = async (req, res) => {
  const { student_id } = req.params;
  console.log("student_id", student_id);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedStudent = await Students.findByIdAndDelete(student_id, { session });
    if (!deletedStudent) {
      return res.status(404).json("Student not found");
    }

    await Promise.all([
      BasicDetails.deleteMany({ student_id }, { session }),
      BatchRelatedDetails.deleteMany({ student_id }, { session }),
      EducationalDetails.deleteMany({ student_id }, { session }),
      FamilyDetails.deleteMany({ student_id }, { session }),
      Payment.deleteMany({ student_id }, { session }),
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json("Student and all related records have been successfully deleted.");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json("Error deleting student: " + error.message);
  }
};

const getAdmitCard = async (req, res) => {
  try {
    const { StudentsId } = req.user;
    const studentAdmitCard = await Students.findOne({ StudentsId }).select("admitCard");
    if (!studentAdmitCard) {
      res.status(404).json("Student not found")
    }
    console.log("studentAdmitCard", studentAdmitCard);
    res.status(200).json(studentAdmitCard );
  } catch (error) {
    console.log("error", error)
    res.status(500).json("Error getting admit card: " + error.message);
  }
}
const resultDetails = async (req, res) => {
  try {
    const { StudentsId } = req.user;
    const student = await Students.findOne({ StudentsId }).select("result");

    if (!student) {
      res.status(404).json("Student not found");

    }
    console.log("student", student);
    res.status(200).json({ data: student });
  } catch (error) {
    console.log("error", error);
    res.status(500).json("Error getting result details: " + error.message)

  }

}

module.exports = {
  getStudents,
  getStudentsById,
  addStudents,
  editStudent,
  deleteStudent,
  getAdmitCard,
  resultDetails,
  uploadStudentResult
};
