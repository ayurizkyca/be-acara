import nodemailer from "nodemailer";
import {
  EMAIL_SMTP_SERVICE_NAME,
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_SECURE,
  EMAIL_SMTP_PASS,
  EMAIL_SMTP_USER,
} from "../env";
import ejs from "ejs";
import path from "path";

//menyimpan konfigurasi nodmailer
const transporter = nodemailer.createTransport({
  service: EMAIL_SMTP_SERVICE_NAME,
  host: EMAIL_SMTP_HOST,
  port: EMAIL_SMTP_PORT,
  secure: EMAIL_SMTP_SECURE,
  auth: {
    user: EMAIL_SMTP_USER,
    pass: EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});

export interface ISendMail {
  from: string,
  to: string,
  subject: string,
  html: string
}

//mengirim email
export const sendEmail = async ({ ...mailParams } : ISendMail) => {
  const result = await transporter.sendMail({
    ...mailParams
  });
  return result;
};

//render file ejs
export const renderMailHTML = async(template: string, data: any) => {
  const content = await ejs.renderFile(path.join(__dirname, `templates/${template}`));
  return content;
};


