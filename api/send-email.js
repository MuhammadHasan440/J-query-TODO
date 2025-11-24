const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { task } = req.body;
  if (!task) return res.status(400).json({ success: false, message: "Task missing" });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD
    }
  });

  const mailOptions = {
    from: `"TODO App" <${process.env.EMAIL}>`,
    to: process.env.EMAIL,
    subject: `TODO App Notification`,
    text: `Task Update: ${task}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`EMAIL SENT → ${info.response} | Task: ${task}`);
    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error("EMAIL ERROR →", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
