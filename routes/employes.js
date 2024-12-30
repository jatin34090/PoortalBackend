const Employee = require("../models/Employee");
const { verifyToken, checkRole } = require("../middleware/authentication");
const multer = require('multer');


// Configure multer storage
const storage = multer.memoryStorage(); // Storing file in memory, you can use diskStorage if needed
const upload = multer({ storage: storage });



const express = require("express");
const processCSVAndGenerateResulrCards = require("../utils/ResultGenerator");
const router = express.Router();

router.get("/", verifyToken("hr"), checkRole(["hr"]), async (req, res) => {
    const employees = await Employee.find().select("-password");
    res.send(employees);
});
router.post("/addEmployee", verifyToken, checkRole(["hr"]), async (req, res) => {
    const { name, email, role, password } = req.body;
    const employee = await Employee.findOne({ email: email });

    if (employee) {
        return res.status(400).send("Employee already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmployee = await new Employee({
        name,
        email,
        role,
        password: hashedPassword
    });

    const token = jwt.sign({ _id: newEmployee._id, role: newEmployee.role }, JWT_SECRET);

    res.status(200).send({
        token, employee: {
            name: newEmployee.name,
            email: newEmployee.email,
            role: newEmployee.role,
            task: newEmployee.task,
            profile: newEmployee.profile
        }
    });


})


router.patch("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    console.log("ID", id)
    const employee = await Employee.findById(id);

    if (!employee) {
        return res.status(400).send("Employee not found");
    }

    employee.name = name ? name : employee.name;
    employee.email = email ? email : employee.email;
    employee.role = role ? role : employee.role;
    employee.password = password ? password : employee.password;

    const updatedEmployee = await employee.save();

    res.send(updatedEmployee);
})

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
        return res.status(400).send("Employee not found");
    }

    res.send({ name: employee.name, email: employee.email });
})


 // In-memory storage to process file buffer

// Define the file validation function
function isFileValid(file) {
    const allowedMimes = ['text/csv', 'application/vnd.ms-excel'];
    if (!allowedMimes.includes(file.mimetype)) {
        return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) {
        return false;
    }

    return true;
}

// Your route to handle file upload
router.post("/generateResult", verifyToken("hr"), checkRole(["hr"]), upload.single('file'), async (req, res) => {
    try {
        const { file } = req;  // Access the uploaded file from req.file

        // Ensure the file is provided
        if (!file) {
            return res.status(400).send("File not found");
        }

        // Validate the file
        if (!isFileValid(file)) {
            return res.status(400).send("File is empty or invalid");
        }

        // Here you can access the file buffer and original name
        const fileBuffer = file.buffer;  // The file content as a Buffer
        const fileName = file.originalname;  // The file name

        console.log("File name:", fileName);  // Debug the file name
        console.log("File buffer length:", fileBuffer.length);  // Debug file buffer length

        // Process the CSV file from the buffer
      await processCSVAndGenerateResulrCards(fileBuffer, fileName);  // Pass buffer to your processing function
        // console.log("Result:", result);

        res.status(200).send("Result generated successfully");
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Your route handler with file handling





// router.post("/generateResult", verifyToken("hr"), checkRole(["hr"]), async (req, res) => {
//     try {

//         const { file } = req.body;
//         console.log("file", req);
//         console.log("req.body", req.body);
//         console.log("file", file);
//         if (!file) {
//             return res.status(400).send("File not found");
//         }
//         if (!isFileValid(file)) {
//             return res.status(400).send("File is empty");
//         }
//         const result = await processCSVAndGenerateResulrCards(file);
//         console.log("result", result);

//         res.status(200).send(result);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// })

module.exports = router;