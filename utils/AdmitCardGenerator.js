const fs = require("fs");
const { JSDOM } = require("jsdom");
const pdf = require("html-pdf");
const PDFDocument = require("pdfkit");
const csv = require("csv-parser");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const puppeteer = require("puppeteer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to check if the file is valid (non-empty)
const isFileValid = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size > 0;
  } catch (error) {
    console.error("Error checking file size:", error);
    return false;
  }
};



const generateAdmitCardPDF = async (data, filePath) => {
  console.log("data", data);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const logoPath = path.resolve(__dirname, 'SDATLogo-01.png');


  const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
          }
          .admit-card {
            width: 800px;
            margin: 30px auto;
            padding: 20px;
            background-color: #c91717;
            color: white;
            border: 2px solid #000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          .admit-card .header {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
          }
  
          .admit-card .stream-section,
          .admit-card .class-section {
            display: flex;
            gap: 20px;
            margin: 10px 0;
          }
  
          .admit-card input[type="checkbox"] {
            margin-right: 5px;
          }
  
          .admit-card .details-section {
            margin-top: 20px;
          }
  
          .admit-card .details-section label {
            display: inline-block;
            width: 200px;
            font-weight: bold;
            margin-bottom: 10px;
          }
  
          .admit-card .photo-section {
            border: 2px dashed white;
            width: 150px;
            height: 200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            color: white;
            text-align: center;
          }
  
          .admit-card .footer {
            font-size: 12px;
            text-align: center;
            margin-top: 20px;
            font-weight: bold;
          }
  
          .mainSection {
            width: 100%;
            display: flex;
            gap: 20px;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="admit-card">
          <div class="header">S.DAT - Acknowledgement Slip / Admit Card</div>
          <div class="mainSection">
            <div>
              <div class="stream-section">
                <label>Stream:</label>
                <label><input type="checkbox" id="medical" ${data.stream === 'Medical' ? 'checked' : ''}/> Medical</label>
                <label><input type="checkbox" id="engineering" ${data.stream === 'Engineering' ? 'checked' : ''}/> Engineering</label>
                <label><input type="checkbox" id="foundation" ${data.stream === 'Foundation' ? 'checked' : ''}/> Foundation</label>
              </div>
              <div class="class-section">
              <label>Class:</label>
                ${['V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
      .map(classLevel => `<label><input type="checkbox" id="class-${classLevel.toLowerCase()}" ${data.class === classLevel ? 'checked' : ''}/> ${classLevel}</label>`).join('')}
              </div>
              <div class="details-section">
                <label>Student's Name:</label>
                <span>${data.studentName}</span>
                <br />
                <label>Date of Birth:</label>
                <span>${data.Registration}</span>
                <br />
                <label>Exam Date:</label>
                <span>${data.examDate}</span>
                <br />
                <label>Exam Time:</label>
                <span>${data.examTime}</span>
                <br />
                <label>Center Address:</label>
                <span>${data.CenterName}</span>
                <br />
                <label>Center Name:</label>
                <span>${data.CenterAddress}</span>
                <br />
               
              </div>
            </div>
            <div class="photo-section">
              <span>Paste a Recent Photograph</span>
            </div>
          </div>
          <div class="footer">
            SD House (Corporate Office): Sai Mandir Road, Building 1, Building 2, and
            Building 4: Near Qila, Kanth Road.
            <br />
            CONTACT: +91 8126555222 / 333 | www.scholarsden.in |
            scholarsden
          </div>
        </div>
      </body>
      </html>
    `;

  await page.setContent(htmlContent);
  await page.pdf({ path: filePath, format: 'A4', printBackground: true });
  await browser.close();
};





// Function to upload a file to Cloudinary
const uploadToCloudinary = async (filePath, rollNumber) => {
  try {
    const folder = "admit_cards"; // Folder name in Cloudinary
    const publicId = `${folder}/${rollNumber}`; // Store the file with the student's roll number as the name

    console.log(`Uploading ${filePath} to Cloudinary...`);
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw", // Specify 'raw' for non-image files like PDFs
      public_id: publicId,  // Set custom public ID for the file

    });
    console.log(`Uploaded to Cloudinary: ${result.url}`);
    return result.url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

// Function to process CSV data and generate admit cards
const processHTMLAndGenerateAdmitCards = async (student) => {
  console.log("student form processCSVAndGenerateAdmitCards", student);


  const pdfFilePath = `./admit_card_${student.email}.pdf`;
  const date = new Date(student.dob);

  // Format the date to dd-mm-yy
  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year

  const formattedDate = `${day}-${month}-${year}`;

  console.log(formattedDate);

  const studentData = {
    studentName: student.name,
    Registration: student.studentId,
    class: student.class,
    stream: student.stream,
    fatherName: student.fatherName,
    examDate: student.examDate,
    examTime: student.examTime,
    CenterName: student.CenterName,
    CenterAddress: student.CenterAddress,


  };
  // console.log("studentData",  studentData.dob.split("T")[0] );

  try {
    // Choose between generating the PDF from HTML or PDFKit

    await generateAdmitCardPDF(studentData, pdfFilePath); // HTML-to-PDF example

    console.log(`Generated admit card for Roll Number: ${student.studentId}`);

    // Ensure that the file is valid before uploading
    if (isFileValid(pdfFilePath)) {
      // Upload the admit card to Cloudinary
      const url = await uploadToCloudinary(pdfFilePath, student.studentId);
      console.log(`Admit card URL for ${student.studentId}: ${url}`);
      fs.unlinkSync(pdfFilePath);
      return url;
    } else {
      console.log(`Generated PDF for ${student.studentId} is empty or invalid.`);

    }

    // Optionally, delete the local file after upload
    fs.unlinkSync(pdfFilePath);

  } catch (error) {
    console.error(`Error processing admit card for Roll Number: ${student.studentId}`, error);
  }

};







module.exports = processHTMLAndGenerateAdmitCards;