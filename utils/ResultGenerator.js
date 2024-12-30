const fs = require("fs");
const { JSDOM } = require("jsdom");
const pdf = require("html-pdf");
const PDFDocument = require("pdfkit");
const csv = require("csv-parser");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

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
const puppeteer = require('puppeteer');

const generateAdmitCardPDF = async (data, filePath) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

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
                <label><input type="checkbox" id="medical" ${data.stream === 'Medical' ? 'checked' : ''}/> Medical</label>
                <label><input type="checkbox" id="engineering" ${data.stream === 'Engineering' ? 'checked' : ''}/> Engineering</label>
                <label><input type="checkbox" id="foundation" ${data.stream === 'Foundation' ? 'checked' : ''}/> Foundation</label>
              </div>
              <div class="class-section">
                ${['V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
      .map(classLevel => `<label><input type="checkbox" id="class-${classLevel.toLowerCase()}" ${data.classLevel === classLevel ? 'checked' : ''}/> ${classLevel}</label>`).join('')}
              </div>
              <div class="details-section">
                <label>Student's Name:</label>
                <span>${data.studentName}</span>
                <br />
                <label>Date of Birth:</label>
                <span>${data.dob}</span>
                <br />
                <label>Gender:</label>
                <span>${data.gender}</span>
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


const generateReportCardPDF = async (data, filePath) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // const htmlContent = `
  //   <!DOCTYPE html>
  //   <html lang="en">
  //   <head>
  //     <meta charset="UTF-8">
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //     <title>Report Card</title>
  //     <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  //     <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-3d"></script>

  //     <style>
  //       body {
  //         font-family: Arial, sans-serif;
  //         margin: 0;
  //         padding: 0;
  //         background-color: #f8f8f8;
  //       }

  //       .report-card {
  //         width: 210mm;
  //         height: 297mm;
  //         margin: auto;
  //         background-color: white;
  //         border: 3px solid #c91717;
  //         box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  //         padding: 20px;
  //         box-sizing: border-box;
  //       }

  //       .header {
  //         display: flex;
  //         justify-content: space-between;
  //         align-items: center;
  //         margin-bottom: 10px;
  //       }

  //       .header img {
  //         height: 60px;
  //       }

  //       .header h1 {
  //         font-size: 24px;
  //         color: #c91717;
  //         text-align: center;
  //         flex-grow: 1;
  //       }

  //       .header .exam-date {
  //         font-size: 12px;
  //         color: #333;
  //         text-align: center;
  //         margin-top: 5px;
  //       }

  //       .student-details {
  //         display: flex;
  //         justify-content: space-between;
  //         margin: 10px 0;
  //         border: 2px solid #c91717;
  //         padding: 10px;
  //       }

  //       .student-info {
  //         font-size: 14px;
  //         line-height: 1.6;
  //       }

  //       .student-photo {
  //         width: 120px;
  //         height: 120px;
  //         border: 2px dashed gray;
  //         display: flex;
  //         align-items: center;
  //         justify-content: center;
  //         font-size: 12px;
  //         color: gray;
  //         text-align: center;
  //       }

  //       .marks-table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         margin: 10px 0;
  //         font-size: 12px;
  //       }

  //       .marks-table th,
  //       .marks-table td {
  //         border: 1px solid #c91717;
  //         text-align: center;
  //         padding: 6px;
  //       }

  //       .marks-table th {
  //         background-color: #c91717;
  //         color: white;
  //       }

  //       .graphs {
  //         display: flex;
  //         flex-wrap: wrap;
  //         justify-content: space-between;
  //         margin-top: 10px;
  //       }

  //       .graph-container {
  //         width: 48%;
  //         height: 200px;
  //         margin-bottom: 10px;
  //       }

  //       .footer {
  //         text-align: center;
  //         font-size: 10px;
  //         margin-top: 10px;
  //         color: #555;
  //       }
  //     </style>
  //   </head>
  //   <body>
  //     <div class="report-card">
  //       <!-- Header -->
  //       <div class="header">
  //         <img src="https://via.placeholder.com/100x60" alt="Logo">
  //         <div>
  //           <h1>REPORT CARD 2024</h1>
  //           <div class="exam-date">Examination Date: 20<sup>th</sup> October '24</div>
  //         </div>
  //         <img src="https://via.placeholder.com/100x60" alt="Logo">
  //       </div>

  //       <!-- Student Details -->
  //       <div class="student-details">
  //         <div class="student-info">
  //           <p><b>Name:</b> ${data.studentName}</p>
  //           <p><b>Registration No.:</b> ${data.registrationNo}</p>
  //           <p><b>Father's Name:</b> ${data.fathersName}</p>
  //           <p><b>Mother's Name:</b> ${data.mothersName}</p>
  //           <p><b>Class:</b> ${data.class}</p>
  //           <p><b>Scholarship:</b> ${data.scholarship}</p>
  //           <p><b>Rank:</b> ${data.rank}</p>
  //           <p><b>Percentage:</b> ${data.percentage}%</p>
  //         </div>
  //         <div class="student-photo">PHOTO NOT AVAILABLE</div>
  //       </div>

  //       <!-- Marks Table -->
  //       <table class="marks-table">
  //         <thead>
  //           <tr>
  //             <th>Subject</th>
  //             <th>Marks Obtained</th>
  //             <th>Full Marks</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${data.subjects.map(subject => `
  //             <tr>
  //               <td>${subject.name}</td>
  //               <td>${subject.obtained}</td>
  //               <td>${subject.fullMarks}</td>
  //             </tr>
  //           `).join('')}
  //           <tr>
  //             <td><b>Total</b></td>
  //             <td><b>${data.totalObtained}</b></td>
  //             <td><b>${data.totalMarks}</b></td>
  //           </tr>
  //         </tbody>
  //       </table>

  //       <!-- Graphs Section -->
  //       <div class="graphs">
  //         <div class="graph-container">
  //           <canvas id="fullMarksChart"></canvas>
  //         </div>
  //         <div class="graph-container">
  //           <canvas id="obtainedMarksChart"></canvas>
  //         </div>
  //         <div class="graph-container">
  //           <canvas id="comparisonChart"></canvas>
  //         </div>
  //         <div class="graph-container">
  //           <canvas id="rankChart"></canvas>
  //         </div>
  //       </div>

  //       <!-- Footer -->
  //       <div class="footer">
  //         Scholars Den, Near Qila, Kanth Road, Moradabad (UP) 244001<br>
  //         Contact: +91 8126555222 | www.scholarsden.in
  //       </div>
  //     </div>

  //     <script>
  //       // Full Marks 3D Pie Chart
  //       const fullMarksCtx = document.getElementById('fullMarksChart').getContext('2d');
  //       new Chart(fullMarksCtx, {
  //         type: 'pie',
  //         data: {
  //           labels: ${JSON.stringify(data.subjects.map(subject => subject.name))},
  //           datasets: [{
  //             data: ${JSON.stringify(data.subjects.map(subject => subject.fullMarks))},
  //             backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
  //           }]
  //         },
  //         options: {
  //           plugins: {
  //             chartJsPlugin3d: {
  //               enabled: true,
  //               perspective: 60,
  //               depth: 15
  //             },
  //             legend: {
  //               position: 'bottom',
  //             }
  //           },
  //           responsive: true,
  //           maintainAspectRatio: false
  //         }
  //       });

  //       // Obtained Marks 3D Pie Chart
  //       const obtainedMarksCtx = document.getElementById('obtainedMarksChart').getContext('2d');
  //       new Chart(obtainedMarksCtx, {
  //         type: 'pie',
  //         data: {
  //           labels: ${JSON.stringify(data.subjects.map(subject => subject.name))},
  //           datasets: [{
  //             data: ${JSON.stringify(data.subjects.map(subject => subject.obtained))},
  //             backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
  //           }]
  //         },
  //         options: {
  //           plugins: {
  //             chartJsPlugin3d: {
  //               enabled: true,
  //               perspective: 60,
  //               depth: 15
  //             },
  //             legend: {
  //               position: 'bottom',
  //             }
  //           },
  //           responsive: true,
  //           maintainAspectRatio: false
  //         }
  //       });

  //       // Comparison Chart (3D Bar)
  //       const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
  //       new Chart(comparisonCtx, {
  //         type: 'bar',
  //         data: {
  //           labels: ${JSON.stringify(data.subjects.map(subject => subject.name))},
  //           datasets: [
  //             {
  //               label: 'Marks Obtained',
  //               data: ${JSON.stringify(data.subjects.map(subject => subject.obtained))},
  //               backgroundColor: '#FF6384',
  //             },
  //             {
  //               label: 'Full Marks',
  //               data: ${JSON.stringify(data.subjects.map(subject => subject.fullMarks))},
  //               backgroundColor: '#36A2EB',
  //             }
  //           ]
  //         },
  //         options: {
  //           plugins: {
  //             chartJsPlugin3d: {
  //               enabled: true,
  //               perspective: 60,
  //               depth: 15
  //             },
  //             legend: {
  //               position: 'bottom',
  //             }
  //           },
  //           responsive: true,
  //           maintainAspectRatio: false
  //         }
  //       });

  //       // Rank Chart (3D Bar)
  //       const rankCtx = document.getElementById('rankChart').getContext('2d');
  //       new Chart(rankCtx, {
  //         type: 'bar',
  //         data: {
  //           labels: ${JSON.stringify(data.subjects.map(subject => subject.name))},
  //           datasets: [
  //             {
  //               label: 'Rank',
  //               data: ${JSON.stringify(data.subjects.map(() => data.rank))},
  //               backgroundColor: '#4BC0C0',
  //             }
  //           ]
  //         },
  //         options: {
  //           plugins: {
  //             chartJsPlugin3d: {
  //               enabled: true,
  //               perspective: 60,
  //               depth: 15
  //             },
  //             legend: {
  //               position: 'bottom',
  //             }
  //           },
  //           responsive: true,
  //           maintainAspectRatio: false
  //         }
  //       });
  //     </script>
  //   </body>
  //   </html>
  // `;

  const htmlContent = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Card</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-3d"></script>

  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8f8f8;
    }

    .report-card {
     
      margin: auto;
      background-color: white;
      border: 3px solid #c91717;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .header img {
      height: 60px;
    }

    .header h1 {
      font-size: 24px;
      color: #c91717;
      text-align: center;
      flex-grow: 1;
    }

    .header .exam-date {
      font-size: 12px;
      color: #333;
      text-align: center;
      margin-top: 5px;
    }

    .student-details {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      border: 2px solid #c91717;
      padding: 10px;
    }

    .student-info {
      font-size: 14px;
      line-height: 0.7;
    }

    .student-photo {
      width: 120px;
      height: 120px;
      border: 2px dashed gray;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: gray;
      text-align: center;
    }

    .marks-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 12px;
    }

    .marks-table th,
    .marks-table td {
      border: 1px solid #c91717;
      text-align: center;
      padding: 6px;
    }

    .marks-table th {
      background-color: #c91717;
      color: white;
    }

    .graphs {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 10px;
    }

    .graph-container {
      width: 48%;
      height: 200px;
      margin-bottom: 10px;
    }

    .footer {
      text-align: center;
      font-size: 10px;
      margin-top: 10px;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="report-card">
    <!-- Header -->
    <div class="header">
      <img src="https://via.placeholder.com/100x60" alt="Logo">
      <div>
        <h1>REPORT CARD 2024</h1>
        <div class="exam-date">Examination Date: 20<sup>th</sup> October '24</div>
      </div>
      <img src="https://via.placeholder.com/100x60" alt="Logo">
    </div>

    <!-- Student Details -->
    <div class="student-details">
      <div class="student-info">
        <p><b>Name:</b> Aryan Prakash</p>
        <p><b>Registration No.:</b> 202510026</p>
        <p><b>Father's Name:</b> Mr. Jai Prakash</p>
        <p><b>Mother's Name:</b> Mrs. Gunjan Tiwari</p>
        <p><b>Class:</b> 10th</p>
        <p><b>Scholarship:</b> 90% (Valid till 25th Nov '24)</p>
        <p><b>Rank:</b> 1</p>
        <p><b>Percentage:</b> 81%</p>
      </div>
      <div class="student-photo">PHOTO NOT AVAILABLE</div>
    </div>

    <!-- Marks Table -->
    <table class="marks-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Marks Obtained</th>
          <th>Full Marks</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>MAT</td>
          <td>33</td>
          <td>50</td>
        </tr>
        <tr>
          <td>Mathematics</td>
          <td>15</td>
          <td>15</td>
        </tr>
        <tr>
          <td>Physics</td>
          <td>6</td>
          <td>7</td>
        </tr>
        <tr>
          <td>Chemistry</td>
          <td>7</td>
          <td>7</td>
        </tr>
        <tr>
          <td>Biology</td>
          <td>5</td>
          <td>7</td>
        </tr>
        <tr>
          <td>SST</td>
          <td>15</td>
          <td>15</td>
        </tr>
        <tr>
          <td><b>Total</b></td>
          <td><b>81</b></td>
          <td><b>100</b></td>
        </tr>
      </tbody>
    </table>

    <!-- Graphs Section -->
    <div class="graphs">
      <div class="graph-container">
        <canvas id="fullMarksChart"></canvas>
      </div>
      <div class="graph-container">
        <canvas id="obtainedMarksChart"></canvas>
      </div>
      <div class="graph-container">
        <canvas id="comparisonChart"></canvas>
      </div>
      <div class="graph-container">
        <canvas id="rankChart"></canvas>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      Scholars Den, Near Qila, Kanth Road, Moradabad (UP) 244001<br>
      Contact: +91 8126555222 | www.scholarsden.in
    </div>
  </div>

  <script>
    // Full Marks 3D Pie Chart
    const fullMarksCtx = document.getElementById('fullMarksChart').getContext('2d');
    new Chart(fullMarksCtx, {
      type: 'pie',
      data: {
        labels: ['MAT', 'Maths', 'Physics', 'Chemistry', 'Biology', 'SST'],
        datasets: [{
          data: [50, 15, 7, 7, 7, 15],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        }]
      },
      options: {
        plugins: {
          chartJsPlugin3d: {
            enabled: true,
            perspective: 60,
            depth: 15
          },
          legend: {
            position: 'bottom',
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    // Obtained Marks 3D Pie Chart
    const obtainedMarksCtx = document.getElementById('obtainedMarksChart').getContext('2d');
    new Chart(obtainedMarksCtx, {
      type: 'pie',
      data: {
        labels: ['MAT', 'Maths', 'Physics', 'Chemistry', 'Biology', 'SST'],
        datasets: [{
          data: [33, 15, 6, 7, 5, 15],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        }]
      },
      options: {
        plugins: {
          chartJsPlugin3d: {
            enabled: true,
            perspective: 60,
            depth: 15
          },
          legend: {
            position: 'bottom',
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    // Comparison Chart (3D Bar)
    const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
    new Chart(comparisonCtx, {
      type: 'bar',
      data: {
        labels: ['MAT', 'Maths', 'Physics', 'Chemistry', 'Biology', 'SST'],
        datasets: [
          {
            label: 'Marks Obtained',
            data: [33, 15, 6, 7, 5, 15],
            backgroundColor: '#FF6384',
          },
          {
            label: 'Full Marks',
            data: [50, 15, 7, 7, 7, 15],
            backgroundColor: '#36A2EB',
          }
        ]
      },
      options: {
        plugins: {
          chartJsPlugin3d: {
            enabled: true,
            perspective: 60,
            depth: 15
          },
          legend: {
            position: 'bottom',
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    // Rank Chart (3D Bar)
    const rankCtx = document.getElementById('rankChart').getContext('2d');
    new Chart(rankCtx, {
      type: 'bar',
      data: {
        labels: ['MAT', 'Maths', 'Physics', 'Chemistry', 'Biology', 'SST'],
        datasets: [
          {
            label: 'Rank',
            data: [1, 2, 5, 3, 6, 2],
            backgroundColor: '#4BC0C0',
          }
        ]
      },
      options: {
        plugins: {
          chartJsPlugin3d: {
            enabled: true,
            perspective: 60,
            depth: 15
          },
          legend: {
            position: 'bottom',
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  </script>
</body>
</html>
`
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
const processCSVAndGenerateResulrCards = async (csvFilePath) => {
    const students = [];
    const allUrls = {};

    return new Promise((resolve, reject) => {
        // Start reading the CSV file
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on("data", (row) => {
              console.log("Row:", row);
                students.push(row); 
            })
            .on("end", async () => {
                console.log("CSV file successfully processed.");
                console.log("Number of students:", students.length);

                for (const student of students) {
                    const pdfFilePath = `./admit_card_${student.Registration}.pdf`;

                    try {
                        console.log("Student data:", student);

                        // Generate the admit card PDF for the student
                        await generateReportCardPDF(student, pdfFilePath);

                        console.log(`Generated admit card for Roll Number: ${student.Registration}`);

                        // Validate the generated PDF file before uploading
                        if (isFileValid(pdfFilePath)) {
                            // Upload the generated admit card to Cloudinary
                            const url = await uploadToCloudinary(pdfFilePath, student.Registration);
                            allUrls[student.Registration] = url;

                            console.log(`Admit card URL for ${student.Registration}: ${url}`);
                        } else {
                            console.log(`Generated PDF for ${student.Registration} is empty or invalid.`);
                        }

                        // Optionally, delete the local PDF after uploading to Cloudinary
                        fs.unlinkSync(pdfFilePath);
                    } catch (error) {
                        console.error(`Error processing admit card for Roll Number ${student.Registration}:`, error);
                    }
                }

                // Resolve the promise with the URLs once all students are processed
                resolve(allUrls);
            })
            .on("error", (error) => {
                console.error("Error reading CSV file:", error);
                reject(error); // Reject the promise on file reading error
            });
    });
};


// Run the script
// const csvFilePath = "./students.csv"; // Path to your CSV file
// processCSVAndGenerateAdmitCards(csvFilePath);


module.exports = processCSVAndGenerateResulrCards;