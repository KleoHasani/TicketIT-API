("use strict");
const { PassportStatic } = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const { validateUser } = require("../Models/User.model");

/**
 *
 * @param {PassportStatic} passport
 */
module.exports = (passport) => {
  passport.use(
    new Strategy(
      {
        secretOrKey: process.env.ACCESS_TOKEN,
        algorithms: ["HS512"],
        issuer: "TICKETIT-API",
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (data, done) => {
        try {
          const user = await validateUser(data.payload);
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};
