// import "tsconfig-paths/register";
import os from "node:os";
import fs from "node:fs";
import { createServer } from "node:https";
import { startApp } from "./app";
import { config } from '@config';

const getPrivateIPs = () => {
  const priv = [/^10\./, /^192\.168\./, /^172\.(1[6-9]|2\d|3[0-1])\./];
  const nets = os.networkInterfaces();
  const out = [];
  for (const [name, addrs] of Object.entries(nets)) {
    for (const a of addrs || []) {
      if (
        a.family === "IPv4" &&
        !a.internal &&
        priv.some((r) => r.test(a.address))
      ) {
        out.push({ name, address: a.address });
      }
    }
  }
  return out;
};
//
const startServer = async () => {
  try {
    const app = await startApp();

    const port = config.port || 3000;
    // app.listen(port, () => console.log(`Listening on port ${port}`));
    await new Promise<void>((resolve) => app.listen({ port }, resolve));
    if (+config.ssl) {
      createServer(
        {
          key: fs.readFileSync("/etc/privekey.pem"),
          cert: fs.readFileSync("/etc/cert.pem"),
          ca: fs.readFileSync("/etc/chain.pem"),
        },
        app as any,
      ).listen(443, () => console.log("HTTPS Listening on port 443"));
    }
    const ips = getPrivateIPs();
    const ip = ips[0]?.address || "127.0.0.1";
    const url = `http://${ip}:${config.port}`;
    console.log(`Lokalnie:   http://localhost:${config.port}`);
    console.log(`Na telefon: ${url}`);
  } catch (error) {
    console.error("Błąd podczas uruchamiania serwera:", error);
    process.exit(1);
  }
};
//
await startServer();
