Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
var path_1 = require("path");
var multer_1 = require("multer");
var fs_1 = require("fs");
var dirname_js_1 = require("./dirname.js");
var storage = multer_1.default.diskStorage({
  destination: (_req, _file, cb) => {
    var dirPath = path_1.default.join(
      (0, dirname_js_1.__dirname)(import.meta.url),
      "../../public/img/uploads/",
    );
    if (!fs_1.default.existsSync(dirPath)) {
      fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
    cb(null, dirPath);
  },
  filename: (_req, file, cb) => {
    var name = "".concat(Date.now(), "_").concat(file.originalname);
    cb(null, name);
  },
});
exports.upload = (0, multer_1.default)({
  storage: storage,
});
