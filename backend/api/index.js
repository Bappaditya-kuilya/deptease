// Node 26 removed Buffer.SlowBuffer; buffer-equal-constant-time still requires it.
const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = class SlowBuffer extends buffer.Buffer {};
}

const app = require("../index");

module.exports = app;
