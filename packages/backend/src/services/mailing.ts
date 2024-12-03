import { createTestAccount, createTransport, getTestMessageUrl } from "nodemailer";
import { renderFile } from "ejs";
import { config } from "../config.js";
import { __dirname } from "./dirname.js";

export const mailer = async (email: string, subject: string, content: any): Promise<void> => {

  console.log(email);
  const testAccount = await createTestAccount();

  const transporter = createTransport({
    host: config.emailHost,
    // host: "smtp.ethereal.email",
    port: parseInt(config.emailPort as string, 10),
    // port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  await renderFile(`${__dirname(import.meta.url)}/../views/pages/mailing/subscribe.ejs`, { content }, async (err: any, data: any) => {
    if (err) {
      console.log(err);
    } else {
      const info = await transporter.sendMail({
        from: "adam.test@test.test",
        to: email,
        subject: subject,
        text: "Dzięki za zapis",
        html: data
      });
      console.log(getTestMessageUrl(info));
    }
  });
};