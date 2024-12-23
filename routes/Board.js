const express = require("express");

const BoardList = require("../models/BoardList");

const router = express.Router();

router.get("/", async (req, res) => {
  const boards = await BoardList.find();
  if (!boards || boards.length === 0) {
    return res.status(404).send("No boards found");
  }
  res.status(200).send(boards);
});

router.post("/addBoard", async (req, res) => {
  const { boardName } = req.body;
  try {
    const board = await BoardList.findOne({ boardName });
    if (board) {
      return res.status(400).send("Board already exists");
    }
    const newBoard = new Board({
      boardName,
    });

    const savedBoard = await newBoard.save();

    res.status(200).send(savedBoard);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Array of board names you provided
// const boardNames = [
//   "Andhra Pradesh Open School Society",
//   "Assam Higher Secondary Education Council (AHSEC)",
//   "Assam Sanskrit Board",
//   "Assam State Open School (ASOS) (under banner of AHSEC)",
//   "Banasthali Vidyapith",
//   "Bhartiya Shiksha Board, Haridwar",
//   "Bihar Board of Open Schooling & Examination (BBOSE), Patna",
//   "Bihar Sanskrit Shiksha Board, Patna",
//   "Bihar School Examination Board, Patna",
//   "Bihar State Madrasa Education Board, Patna",
//   "Board of High School and Intermediate Education, Uttar Pradesh, Prayagraj",
//   "Board of Higher Secondary Educations, Kerala",
//   "Board of Intermediate Education, Andhra Pradesh",
//   "Board of Open Schooling and Skill Education, Sikkim",
//   "Board of Public Examinations, Kerala",
//   "Board of School Education Uttarakhand, Ramnagar (Nainital)",
//   "Board of School Education, Haryana, Bhiwani",
//   "Board of Secondary Education, Andhra Pradesh",
//   "Board of Secondary Education, Madhya Pradesh",
//   "Board of Secondary Education, Manipur",
//   "Board of Secondary Education, Odisha, Cuttack",
//   "Board of Secondary Education, Rajasthan",
//   "Board of Secondary Education, Telangana",
//   "Board of Secondary Sanskrit Education Council, Uttar Pradesh, Lucknow",
//   "Board of Technical Education, Goa",
//   "Board of Vocational Higher Secondary Examinations, Kerala",
//   "Central Board of Secondary Education (CBSE)",
//   "Chhattisgarh Board of Secondary Education, Raipur",
//   "Chhattisgarh Madhyamik Shiksha Mandal, Raipur",
//   "Chhattisgarh Madrsa Board, Raipur",
//   "Chhattisgarh Sanskrit Vidyamandalam, Raipur",
//   "Chhattisgarh State of Open School, Raipur",
//   "Council for the Indian School Certificate Examination",
//   "Council of Higher Secondary Education, Manipur",
//   "Council of Higher Secondary Education, Odisha Bhubaneswar",
//   "Dayalbagh Educational Institute",
//   "Delhi Board of School Education (DBSE)",
//   "Dr. Shakuntala Mishra Punarvas University, Lucknow",
//   "Goa Board of Secondary & Higher Secondary Education, Alto Betim-Goa",
//   "Govt. of Karnataka Dept of Pre-University Education",
//   "Gujarat Secondary and Higher Secondary Education Board",
//   "Gurukula Kangri Vishwavidyalaya",
//   "Himachal Pradesh Board of School Education",
//   "Himachal Pradesh Takniki Shiksha Board",
//   "HP University Shimla",
//   "Jammu & Kashmir Board of Technical Education",
//   "Jammu & Kashmir State Council for vocational Training (SCVT)",
//   "Jammu & Kashmir State Open school (subsidiary of Jammu & Kashmir Board of School Education)",
//   "Jharkhand Academic Council, Ranchi",
//   "Junior Technical School Kangra",
//   "Karnataka School Examination and Assessment Board (KSEAB)",
//   "Karnataka Secondary Education Examination Board",
//   "Kumar Bhaskar Varma Sanskrit & Ancient Studies, Namati, Assam",
//   "Madhya Pradesh State Open School Education Board",
//   "Madhyamik Shiksha Mandal Madhya Pradesh, Bhopal",
//   "Maharashtra State Board of Open Schools, Pune",
//   "Maharashtra State Board of Secondary and Higher Secondary, Pune recognized by state of Maharashtra",
//   "Maharshi Sandipani Rashtriya Veda Sanskrit Shiksha Board, Ujjain",
//   "Manipur University Canchipur",
//   "Meghalaya Board of School Education",
//   "Meghalaya State Council for Technical Education",
//   "Mizoram Board of School Education",
//   "Nagaland Board of School Education, Kohima, Nagaland",
//   "National Council for vocational Training (NCVT), DGT, MSDE",
//   "National Institute of Open Schooling (NIOS)",
//   "Odisha State Board of Madrasa Education, Bhubaneswar",
//   "Punjab School Education Board, Mohali",
//   "Punjab State Board of Technical Education and Industrial Training",
//   "Rajasthan State Open School, Jaipur",
//   "Rajiv Gandhi University of Knowledge Technologies (RGUKT), Telangana",
//   "Sanskrit Board- Maharishi Patanjali Sanskrit Sansthan, Madhya Pradesh",
//   "Secondary Education Board of Assam (SEBA)",
//   "State Board of School Examination, Tamilnadu",
//   "State Board of Technical Education & Training (SBTET), Hyderabad",
//   "State Common Board of School Education, Tamilnadu",
//   "State Madrassa Education Board, Assam",
//   "Board of Technical Education, Uttar Pradesh",
//   "Telangana Open School Society, Hyderabad",
//   "Telangana State Board of Intermediate Education",
//   "The Jammu & Kashmir Board of School Education (JKBOSE)",
//   "Tripura Board of Secondary Education",
//   "U.P Board of Madrasa Education Council, Lucknow",
//   "University of Ladakh",
//   "Uttarakhand Madarsa Shiksha Parishad, Dehradun",
//   "Uttarakhand Sanskrit Education Board, Dehradun",
//   "Vocational Training Courses offered by Directorate of Vocational Training",
//   "West Bengal Board of Primary Education (WBBPE)",
//   "West Bengal Board of Secondary Education (WBBSE)",
//   "West Bengal Council of Higher Secondary Education (WBCHSE)",
//   "West Bengal Council of Rabindra Open Schooling",
//   "West Bengal Madrasah Education for ‘Fazil’",
//   "West Bengal State Council of Technical Education & Vocational Education and Skill Development"
// ];

// // Route to insert all boards into the database
// router.post("/insertBoards", async (req, res) => {
//   try {
//     // Insert all boards into MongoDB
//     await BoardList.insertMany(boardNames.map(name => ({ name })));
//     res.status(200).json({ message: "Boards inserted successfully!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error inserting boards", error });
//   }
// });



module.exports = router;
