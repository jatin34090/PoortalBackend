const Employee = require("../models/Employee");
const {verifyToken, checkRole} = require("../middleware/authentication");

const express = require("express");
const router = express.Router();

router.get("/",verifyToken("hr"), checkRole(["hr"]),  async (req, res) => {
    const employees = await Employee.find().select("-password");
    res.send(employees);
}); 
router.post("/addEmployee", verifyToken, checkRole(["hr"]),  async(req,res)=>{
    const {name, email, role, password} = req.body;
    const employee = await Employee.findOne({email: email});

    if(employee){
        return res.status(400).send("Employee already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newEmployee =await new Employee({
        name,
        email,
        role,
        password: hashedPassword
    });
    
    const token = jwt.sign({ _id: newEmployee._id, role: newEmployee.role  }, JWT_SECRET);

    res.status(200).send({token, employee:{ 
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
        task: newEmployee.task,
        profile: newEmployee.profile
    }});
    
    
})


router.patch("/update/:id", async(req, res) => {
    const {id} = req.params;
    const {name, email, role, password} = req.body;
    console.log("ID", id)
    const employee = await Employee.findById(id);

    if(!employee){
        return res.status(400).send("Employee not found");
    }

    employee.name = name? name : employee.name;
    employee.email = email? email : employee.email;
    employee.role = role? role : employee.role;
    employee.password = password? password : employee.password;

    const updatedEmployee = await employee.save();

    res.send(updatedEmployee);
})

router.delete("/delete/:id", async(req, res) => {
    const {id} = req.params;
    const employee = await Employee.findByIdAndDelete(id);

    if(!employee){
        return res.status(400).send("Employee not found");
    }

    res.send({name: employee.name, email: employee.email});
})


module.exports = router;