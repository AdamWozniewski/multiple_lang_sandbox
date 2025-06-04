import { renderFile } from "ejs";
import { createTransport } from "nodemailer";
import { config } from "../config.js";
import { __dirname } from "./dirname.js";
import { PRODUCTION } from "@static/env.js";

const templatePathTest = (template?: string) =>
  `${__dirname(
    import.meta.url,
  )}/../views/pages/mailing/${template || "subscribe"}.ejs`;

export const mailer = async (
  email: string,
  subject: string,
  content: any,
  templatePath: string,
): Promise<void> => {
  const transporter = createTransport({
    host: config.emailHost,
    port: Number.parseInt(config.emailPort as string, 10),
    secure: false,
    ...(config.env === PRODUCTION && {
      auth: {
        user: config.emailUser as string,
        pass: config.emailPass as string,
      },
      tls: {
        rejectUnauthorized: false,
      },
    }),
  });
  console.log(templatePathTest(templatePath));
  const emailHtml = await new Promise<string>((resolve, reject) => {
    renderFile(templatePathTest(templatePath), { content }, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });

  await transporter.sendMail({
    from: '"Test" <adam.test@test.test>',
    to: email,
    subject,
    text: emailHtml,
    html: emailHtml,
  });
};
