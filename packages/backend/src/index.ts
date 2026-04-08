import os from "node:os";
import fs from "node:fs";
import { createServer } from "node:https";
import { startApp } from "./app";
import { config } from '@config';

function pickPhoneIP() {
  const nets = os.networkInterfaces();
  const candidates: string[] = [];

  for (const [name, addrs] of Object.entries(nets)) {
    for (const a of addrs ?? []) {
      if (a.family !== "IPv4") continue;
      if (a.internal) continue;

      const ip = a.address;

      const lname = name.toLowerCase();
      if (
        lname.includes("docker") ||
        lname.includes("veth") ||
        lname.includes("br-") ||
        lname.includes("vmnet") ||
        lname.includes("vbox") ||
        lname.includes("wsl") ||
        lname.includes("hyper-v") ||
        lname.includes("nat")
      ) continue;

      candidates.push(ip);
    }
  }

  const prefer192 = candidates.find(ip => ip.startsWith("192.168."));
  if (prefer192) return prefer192;

  const prefer10 = candidates.find(ip => ip.startsWith("10."));
  if (prefer10) return prefer10;

  return candidates[0] ?? "127.0.0.1";
}

const startServer = async () => {
  try {
    const app = await startApp();

    const port = config.port || 3000;
    await new Promise<void>((resolve) => app.listen({ port }, resolve));
    if (+config.ssl) {
      createServer(
        {
          key: fs.readFileSync("/etc/privatekey.pem"),
          cert: fs.readFileSync("/etc/cert.pem"),
          ca: fs.readFileSync("/etc/chain.pem"),
        },
        app as any,
      ).listen(443, () => console.log("HTTPS Listening on port 443"));
    }
    const ip = pickPhoneIP();
    const url = `http://${ip}:${port}`;
    console.log(`Lokalnie:   http://localhost:${config.port}`);
    console.log(`Na telefon: ${url}`);
  } catch (error) {
    console.error("Błąd podczas uruchamiania serwera:", error);
    process.exit(1);
  }
};
//
await startServer();
