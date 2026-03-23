const { getDefaultConfig } = require("expo/metro-config");
const fs = require("fs");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.server = config.server || {};
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    if (req.url === "/download-source") {
      const filePath = path.join(__dirname, "..", "..", "lubaki-autoeskola.tar.gz");
      if (fs.existsSync(filePath)) {
        res.setHeader("Content-Disposition", "attachment; filename=lubaki-autoeskola.tar.gz");
        res.setHeader("Content-Type", "application/gzip");
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end("File not found");
      }
      return;
    }
    return middleware(req, res, next);
  };
};

module.exports = config;
