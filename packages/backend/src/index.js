import app from "./app.js";
import {config} from "./config.js";
// import {createServer} from "node:https";

const port = config.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
// if (config.ssl) {
//     createServer({
//         key: fs.readFileSync('/etc/privkey.pem'),
//         cert: fs.readFileSync('/etc/cert.pem'),
//         ca: fs.readFileSync('/etc/chain.pem'),
//     }, app).listen(433, () => console.log(`Listening on port ${433}`));
// }
