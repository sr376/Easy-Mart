import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  //Create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    auth: {
      user: process.env.SMPT_USER,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  // Email Options
  const emailOptions = {
    from: "Eccomerce support<support@ecommerce.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(emailOptions);
};

export default sendEmail;
