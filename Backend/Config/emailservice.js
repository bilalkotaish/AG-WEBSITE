import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    throw new Error("Email service is not configured");
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email delivery failed", {
      code: error.code,
      responseCode: error.responseCode,
      command: error.command,
    });
    throw new Error("Email delivery failed");
  }
};

export { sendEmail };
