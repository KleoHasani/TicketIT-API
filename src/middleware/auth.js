("use strict");
const passport = require("passport");

module.exports = {
  auth: passport.authenticate("jwt", { session: false }),
};
