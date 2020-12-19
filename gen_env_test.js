("use strict");
const { randomBytes } = require("crypto");
const { writeFileSync } = require("fs");
const { resolve, join } = require("path");

(() => {
  const access = randomBytes(32).toString("hex");
  const refresh = randomBytes(32).toString("hex");
  const path = resolve(join(__dirname, ".env.test"));
  const data = `PORT=8000\nMONGO_URI=mongodb://localhost:27017/TicketIT-Test\nACCESS_TOKEN=${access}\nREFRESH_TOKEN=${refresh}`;
  writeFileSync(path, data, { encoding: "utf8", flag: "w" });
})();
