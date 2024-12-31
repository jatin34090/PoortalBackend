const fs = require("fs");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const csvParser = require('csv-parser');
const puppeteer = require('puppeteer');
const { Readable } = require('stream');
const path = require('path');
const Students = require("../models/Student");

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

const generatePDF = async (htmlContent, outputPath) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: outputPath, format: 'A4' });
  await browser.close();
};


// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (filePath, fileName) => {
  try {
    const publicId = fileName.replace(/\.[^/.]+$/, ''); // Removes the file extension

    console.log(`Uploading ${filePath} to Cloudinary...`);
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw',
      public_id: publicId,
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};


// Function to upload a file to Cloudinary
// const uploadToCloudinary = async (filePath, rollNumber) => {
//   try {
//     const folder = "repost_cards"; // Folder name in Cloudinary
//     const publicId = ` ${folder}/${rollNumber}`; // Store the file with the student's roll number as the name

//     console.log(`Uploading ${filePath} to Cloudinary...`);
//     const result = await cloudinary.uploader.upload(filePath, {
//       resource_type: "raw", // Specify 'raw' for non-image files like PDFs
//       public_id: publicId,  // Set custom public ID for the file

//     });
//     console.log(`Uploaded to Cloudinary: ${result.url}`);
//     return result.secure_url;
//   } catch (error) {
//     console.error("Error uploading to Cloudinary:", error);
//     throw error;
//   }
// };
// const processCSVAndGenerateResulrCards = async (file) => {

//   const results = [];
//   console.log("file", file);

//   fs.createReadStream(file.path)
//     .pipe(csvParser())
//     .on('data', (row) => {
//       console.log("row", row);
//       results.push(row);
//     })
//     .on('end', async () => {
//       const pdfLinks = [];

//       for (const student of results) {
//         // Ensure required fields are present
//         //   if (!student.Name || !student.RollNumber || !student.Class) {
//         //     console.error(Missing data for student: ${JSON.stringify(student)});
//         //     continue; // Skip incomplete rows
//         //   }

//         const htmlContent = `
//           <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Report Card</title>
//   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
//   <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-3d"></script>

//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       margin: 0;
//       padding: 0;
//       background-color: #f8f8f8;
//     }

//     .report-card {
     
//       margin: auto;
//       background-color: white;
//       border: 3px solid #c91717;
//       box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
//       padding: 20px;
//       box-sizing: border-box;
//     }

//     .header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       margin-bottom: 10px;
//     }

//     .header img {
//       height: 60px;
//     }

//     .header h1 {
//       font-size: 24px;
//       color: #c91717;
//       text-align: center;
//       flex-grow: 1;
//     }

//     .header .exam-date {
//       font-size: 12px;
//       color: #333;
//       text-align: center;
//       margin-top: 5px;
//     }

//     .student-details {
//       display: flex;
//       justify-content: space-between;
//       margin: 10px 0;
//       border: 2px solid #c91717;
//       padding: 10px;
//     }

//     .student-info {
//       font-size: 14px;
//       line-height: 0.7;
//     }

//     .student-photo {
//       width: 120px;
//       height: 120px;
//       border: 2px dashed gray;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 12px;
//       color: gray;
//       text-align: center;
//     }

//     .marks-table {
//       width: 100%;
//       border-collapse: collapse;
//       margin: 10px 0;
//       font-size: 12px;
//     }

//     .marks-table th,
//     .marks-table td {
//       border: 1px solid #c91717;
//       text-align: center;
//       padding: 6px;
//     }

//     .marks-table th {
//       background-color: #c91717;
//       color: white;
//     }

//     .graphs {
//       display: flex;
//       flex-wrap: wrap;
//       justify-content: space-between;
//       margin-top: 10px;
//     }

//     .graph-container {
//       width: 48%;
//       height: 200px;
//       margin-bottom: 10px;
//     }

//     .footer {
//       text-align: center;
//       font-size: 10px;
//       margin-top: 10px;
//       color: #555;
//     }
//   </style>
// </head>
// <body>
//   <div class="report-card">
//     <!-- Header -->
//     <div class="header">
//       <img src="https://via.placeholder.com/100x60" alt="Logo">
//       <div>
//         <h1>REPORT CARD 2024</h1>
//         <div class="exam-date">Examination Date: 20<sup>th</sup> October '24</div>
//       </div>
//       <img src="https://via.placeholder.com/100x60" alt="Logo">
//     </div>

//     <!-- Student Details -->
//     <div class="student-details">
//       <div class="student-info">
//         <p><b>Name:</b> Aryan Prakash</p>
//         <p><b>Registration No.:</b> 202510026</p>
//         <p><b>Father's Name:</b> Mr. Jai Prakash</p>
//         <p><b>Mother's Name:</b> Mrs. Gunjan Tiwari</p>
//         <p><b>Class:</b> 10th</p>
//         <p><b>Scholarship:</b> 90% (Valid till 25th Nov '24)</p>
//         <p><b>Rank:</b> 1</p>
//         <p><b>Percentage:</b> 81%</p>
//       </div>
//       <div class="student-photo">PHOTO NOT AVAILABLE</div>
//     </div>

//     <!-- Marks Table -->
//     <table class="marks-table">
//       <thead>
//         <tr>
//           <th>Subject</th>
//           <th>Marks Obtained</th>
//           <th>Full Marks</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td>MAT</td>
//           <td>33</td>
//           <td>50</td>
//         </tr>
//         <tr>
//           <td>Mathematics</td>
//           <td>15</td>
//           <td>15</td>
//         </tr>
//         <tr>
//           <td>Physics</td>
//           <td>6</td>
//           <td>7</td>
//         </tr>
//         <tr>
//           <td>Chemistry</td>
//           <td>7</td>
//           <td>7</td>
//         </tr>
//         <tr>
//           <td>Biology</td>
//           <td>5</td>
//           <td>7</td>
//         </tr>
//         <tr>
//           <td>SST</td>
//           <td>15</td>
//           <td>15</td>
//         </tr>
//         <tr>
//           <td><b>Total</b></td>
//           <td><b>81</b></td>
//           <td><b>100</b></td>
//         </tr>
//       </tbody>
//     </table>

//     <!-- Graphs Section -->
//     <div class="graphs">
//       <div class="graph-container">
//         <canvas id="fullMarksChart"></canvas>
//       </div>
//       <div class="graph-container">
//         <canvas id="obtainedMarksChart"></canvas>
//       </div>
//       <div class="graph-container">
//         <canvas id="comparisonChart"></canvas>
//       </div>
//       <div class="graph-container">
//         <canvas id="rankChart"></canvas>
//       </div>
//     </div>

//     <!-- Footer -->
//     <div class="footer">
//       Scholars Den, Near Qila, Kanth Road, Moradabad (UP) 244001<br>
//       Contact: +91 8126555222 | www.scholarsden.in
//     </div>
//   </div>

//   <script>
//     // Full Marks 3D Pie Chart
//     const fullMarksCtx = document.getElementById('fullMarksChart').getContext('2d');
//     new Chart(fullMarksCtx, {
//       type: 'pie',
//       data: {
//         labels: ['MAT', 'Maths', 'Physics', 'Chemistry', 'Biology', 'SST'],
//         datasets: [{
//           data: [50, 15, 7, 7, 7, 15],
//           backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
//         }]
//       },
//       options: {
//         plugins: {
//           chartJsPlugin3d: {
//             enabled: true,
//             perspective: 60,
//             depth: 15
//           },
//           legend: {
//             position: 'bottom',
//           }
//         },
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });

//     // Obtained Marks 3D Pie Chart
//     const obtainedMarksCtx = document.getElementById('obtainedMarksChart').getContext('2d');
//     new Chart(obtainedMarksCtx, {
//       type: 'pie',
//       data: {
//         labels: ['MAT', 'Maths', 'Physics', 'Chemistry', 'Biology', 'SST'],
//         datasets: [{
//           data: [33, 15, 6, 7, 5, 15],
//           backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
//         }]
//       },
//       options: {
//         plugins: {
//           chartJsPlugin3d: {
//             enabled: true,
//             perspective: 60,
//             depth: 15
//           },
//           legend: {
//             position: 'bottom',
//           }
//         },
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });

//     // Comparison Chart (3D Bar)
//     const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
//     new Chart(comparisonCtx, {
//       type: 'bar',
//       data: {
//         labels: ['MAT', 'Maths', 'Physics', 'Chemistry', 'Biology', 'SST'],
//         datasets: [
//           {
//             label: 'Marks Obtained',
//             data: [33, 15, 6, 7, 5, 15],
//             backgroundColor: '#FF6384',
//           },
//           {
//             label: 'Full Marks',
//             data: [50, 15, 7, 7, 7, 15],
//             backgroundColor: '#36A2EB',
//           }
//         ]
//       },
//       options: {
//         plugins: {
//           chartJsPlugin3d: {
//             enabled: true,
//             perspective: 60,
//             depth: 15
//           },
//           legend: {
//             position: 'bottom',
//           }
//         },
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });

//     // Rank Chart (3D Bar)
//     const rankCtx = document.getElementById('rankChart').getContext('2d');
//     new Chart(rankCtx, {
//       type: 'bar',
//       data: {
//         labels: ['MAT', 'Maths', 'Physics', 'Chemistry', 'Biology', 'SST'],
//         datasets: [
//           {
//             label: 'Rank',
//             data: [1, 2, 5, 3, 6, 2],
//             backgroundColor: '#4BC0C0',
//           }
//         ]
//       },
//       options: {
//         plugins: {
//           chartJsPlugin3d: {
//             enabled: true,
//             perspective: 60,
//             depth: 15
//           },
//           legend: {
//             position: 'bottom',
//           }
//         },
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });
//   </script>
// </body>
// </html>`;

//         const tempDir = path.join(__dirname, 'temp');
//         if (!fs.existsSync(tempDir)) {
//           fs.mkdirSync(tempDir, { recursive: true });
//         }

//         const pdfPath = path.join(tempDir, `${ student.Registration }_admit_card.pdf`);
//         await generatePDF(htmlContent, pdfPath);

//         const pdfUrl = await uploadToCloudinary(pdfPath,` ${ student.Registration }_admit_card`);
//         console.log('PDF URL:', pdfUrl);

//         pdfLinks.push({ student: student.Name, url: pdfUrl });

//         // Clean up temporary file
//         fs.unlinkSync(pdfPath);
//       }

//       // Clean up uploaded CSV
//       fs.unlinkSync(file.path);

//       res.status(200).json({ message: 'PDFs generated successfully', pdfLinks });
//     });
// };



const processCSVAndGenerateResulrCards = async (file, res) => {
  const results = [];
  console.log("file", file);

  fs.createReadStream(file.path)
    .pipe(csvParser())
    .on("data", (row) => {
      console.log("row", row);
      results.push(row);
    })
    .on("end", async () => {
      const pdfLinks = [];
      try {
        const tempDir = path.join(__dirname, "temp");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        for (const student of results) {
          try {

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
            </html>`;


            // const htmlContent = `
            //   <!DOCTYPE html>
            //   <html lang="en">
            //   <head>
            //     <meta charset="UTF-8">
            //     <title>Admit Card</title>
            //   </head>
            //   <body>
            //     <h1>Admit Card for ${student.Name}</h1>
            //     <p>Registration: ${student.Registration}</p>
            //     <p>Class: ${student.Class}</p>
            //   </body>
            //   </html>`;

            const pdfPath = path.join(
              tempDir,
              `${student.Registration}_admit_card.pdf`
            );

            await generatePDF(htmlContent, pdfPath);

            // Generate Cloudinary public_id without spaces
            const publicId = `${student.Registration}_admit_card`.trim();

            const pdfUrl = await uploadToCloudinary(pdfPath, publicId);
            const student = await Students.findOne({ StudentsId: student.Registration });
            student.result = pdfUrl;
            await student.save();
            
            console.log("PDF URL:", pdfUrl);
            pdfLinks.push({ student: student.Name, url: pdfUrl });

            // Clean up temporary file
            fs.unlinkSync(pdfPath);
          } catch (err) {
            console.error(
              `Error processing student ${student.Name}:`,
              err.message
            );
          }
        }

        // Clean up uploaded CSV
        fs.unlinkSync(file.path);

        res.status(200).json({
          message: "PDFs generated successfully",
          pdfLinks,
        });
      } catch (err) {
        console.error("Error processing CSV:", err.message);
        res.status(500).json({
          message: "Error processing CSV",
          error: err.message,
        });
      }
    })
    .on("error", (err) => {
      console.error("Error reading CSV file:", err.message);
      res.status(500).json({
        message: "Error reading CSV file",
        error: err.message,
      });
    });
};


module.exports = processCSVAndGenerateResulrCards;