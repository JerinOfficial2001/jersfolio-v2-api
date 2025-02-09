import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
configDotenv();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEnquiryEmail = (
  sendTo: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  request: string,
  message: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sendTo,
    subject: "Jersfolio Builder New Enquiry",
    html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  color: #333;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  padding-bottom: 20px;
                  border-bottom: 2px solid #eee;
                }
                .header h2 {
                  color: #007BFF;
                }
                .content {
                  margin-top: 20px;
                }
                .content p {
                  margin: 10px 0;
                }
                .footer {
                  text-align: center;
                  padding-top: 20px;
                  border-top: 2px solid #eee;
                  margin-top: 20px;
                  color: #aaa;
                }
                a {
                  color: #007BFF;
                  text-decoration: none;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>New Enquiry - Jersfolio Builder</h2>
                </div>
                <div class="content">
                  <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Request:</strong> ${request}</p>
                  <p><strong>Message:</strong></p>
                  <p>${message}</p>
                </div>
                <div class="footer">
                  <p>Please follow up accordingly.</p>
                  <p><a href="https://jers-folio-pro.vercel.app">Visit Jersfolio Builder</a></p>
                </div>
              </div>
            </body>
          </html>
        `,
  };

  return transporter.sendMail(mailOptions);
};
