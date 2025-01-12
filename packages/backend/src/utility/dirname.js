Object.defineProperty(exports, "__esModule", { value: true });
exports.__dirname = void 0;
var url_1 = require("url.js");
var path_1 = require("path.js");
var __dirname = (metaUrl) => {
  var __filename = (0, url_1.fileURLToPath)(metaUrl);
  return path_1.default.dirname(__filename);
};
exports.__dirname = __dirname;
