import { sendEmail } from "./emailservice.js";

const sendEmailFun = async ({ sendTo, subject, text, html }) => {
  const result = await sendEmail({ to: sendTo, subject, text, html });
  if (!result.success) {
    throw new Error("Email delivery failed");
  }

  return result.success;
};

export default sendEmailFun;
