("use strict");
const { randomBytes } = require("crypto");
const { writeFileSync } = require("fs");
const { resolve, join } = require("path");

(() => {
  const access = randomBytes(32).toString("hex");
  const refresh = randomBytes(32).toString("hex");
  const path = resolve(join(__dirname, ".env"));
  const data = `PORT=8000\nMONGO_URI=mongodb://localhost:27017/TicketIT\nACCESS_TOKEN=${access}\nREFRESH_TOKEN=${refresh}\nDOMAIN=http://localhost:3000`;
  writeFileSync(path, data, { encoding: "utf8", flag: "w" });
})();
