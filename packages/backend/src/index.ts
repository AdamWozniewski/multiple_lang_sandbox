import 'tsconfig-paths/register.js';
import fs from "node:fs";
import { createServer } from "node:https";
import { startApp } from "./app.js";
import { config } from "./config.js";

const startServer = async () => {
  try {
    const app = await startApp();

    const port = config.port || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}`));

    if (+config.ssl) {
      createServer(
        {
          key: fs.readFileSync("/etc/privekey.pem"),
          cert: fs.readFileSync("/etc/cert.pem"),
          ca: fs.readFileSync("/etc/chain.pem"),
        },
        app,
      ).listen(443, () => console.log('HTTPS Listening on port 443'));
    }
  } catch (error) {
    console.error("Błąd podczas uruchamiania serwera:", error);
    process.exit(1);
  }
};

startServer();
