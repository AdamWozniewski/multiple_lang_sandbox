import { renderFile } from "ejs";
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from "nodemailer";
import { config } from "../config.js";
import { __dirname } from "./dirname.js";

const templatePathTest = `${__dirname(
  import.meta.url,
)}/../views/pages/mailing/subscribe.ejs`;

export const mailer = async (
  email: string,
  subject: string,
  content: any,
  templatePath: string = templatePathTest,
): Promise<void> => {
  try {
    const testAccount = await createTestAccount();
    const transporter = createTransport({
      host: config.emailHost,
      port: Number.parseInt(config.emailPort as string, 10),
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const emailHtml = await new Promise<string>((resolve, reject) => {
      renderFile(templatePath, { content }, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    const info = await transporter.sendMail({
      from: '"Test" <adam.test@test.test>',
      to: email,
      subject,
      text: emailHtml,
      html: emailHtml,
    });

    console.log("Wiadomość wysłana: %s", info.messageId);
    console.log("Podgląd wiadomości: %s", getTestMessageUrl(info));
  } catch (e) {
    console.log(e);
  }
};
