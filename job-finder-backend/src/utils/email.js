const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({ to, subject, text }) => {
  try {
    // Create the transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // Use TLS for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      //   debug: true,
      //   logger: true,
    });

    // Define the mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);

    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email"); // Throwing error for caller
  }
};

// sendEmail({
//   to: "navstr10@gmail.com",
//   subject: "test",
//   text: "testmail",
// });

module.exports = sendEmail;
