const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Check env variables
if (!process.env.EMAIL || !process.env.APP_PASSWORD) {
  console.error("ERROR: EMAIL or APP_PASSWORD is missing in .env file");
  process.exit(1);
}

// Nodemailer transporter
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

// Verify transporter
transporter.verify(function(error, success) {
  if (error) console.error("EMAIL TRANSPORTER ERROR →", error);
  else console.log("Email transporter ready");
});

// Root route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST route to send email
app.post("/send-email", async (req, res) => {
  const { task } = req.body;
  if (!task) return res.json({ success: false, message: "Task is missing!" });

  let mailOptions = {
    from: `"TODO App" <${process.env.EMAIL}>`,
    to: process.env.EMAIL,
    subject: `TODO App Notification`,
    text: `Task Update: ${task}`
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(`EMAIL SENT → ${info.response} | Task: ${task}`);
    res.json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error("EMAIL ERROR →", err);
    res.json({ success: false, error: err.message });
  }
});

// Start server (use process.env.PORT for Vercel)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
