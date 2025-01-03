const express = require("express");
const router = express.Router();
const {
  getStudents,
  addStudents,
  editStudent,
  deleteStudent,
  getStudentsById,
  getAdmitCard,
  resultDetails,
  uploadStudentResult
} = require("../controllers/Students");

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const servicesid = process.env.servicesid;
const client = require("twilio")(accountSid, authToken);
const { verifyToken, checkRole } = require("../middleware/authentication");

router.get('/', verifyToken("hr"), checkRole(["hr"]), getStudents);
router.post("/addStudent", verifyToken("hr","Student"), checkRole(["hr"]), addStudents);

router.get('/getStudentsById', verifyToken("Student"), checkRole(["Student"]), getStudentsById);

router.patch("/editStudent", verifyToken(["Student"]), checkRole(["Student"]), editStudent);
router.patch("/editStudent/:student_id", verifyToken(["hr", "Student"]), checkRole(["hr"]), editStudent);
router.delete("/deleteStudent/:student_id", verifyToken("hr"), checkRole(["hr"]), deleteStudent);


router.get("/getAdmitCard", verifyToken("Student"), checkRole(["Student"]), getAdmitCard);


router.get("/getResultDetails", verifyToken("Student"), checkRole("Student"), resultDetails);

router.post("/sendVerification", async (req, res) => {
  const { phone } = req.body;
  console.log("phone  ", phone);

  try {
    const verification = await client.verify.v2
      .services("VA84754e3e2214d1a1ba3e1c2e39fc0129")
      .verifications.create({ to: phone, channel: "sms" });

    res.status(200).send(`Code sent to ${phone}, Status: ${verification.status}`);
  } catch (error) {
    console.error("Error starting verification:", error.message);
    res.status(500).send({error:error.message});
  }
});
router.post("/verifyNumber", async (req, res) => {
    const { phone, code } = req.body;
  
    try {
      const verificationCheck = await client.verify.v2
        .services(servicesid)
        .verificationChecks.create({ to: phone, code });
  
      if (verificationCheck.status === "approved") {
        return res.status(200).send("Verification successful");
      } else {
        return res.status(400).send("Verification failed: Invalid code");
      }
    } catch (error) {
      console.error("Error verifying code:", error.message);
      res.status(500).send({error: error.message});
    }
  });
  


router.post("/uploadStudentResult", verifyToken("Hr"), checkRole(["Hr"]), uploadStudentResult);

router.post("/")

module.exports = router;
