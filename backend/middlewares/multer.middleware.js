const multer = require("multer");

// Keep uploads in memory and persist them as data URIs in MongoDB.
// (Vercel serverless has a read-only filesystem; disk storage crashes there.)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, fieldSize: 10 * 1024 * 1024 },
});

module.exports = upload;
