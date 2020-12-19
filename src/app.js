("use-strict");
const express = require("express");
const passport = require("passport");

// Config
require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});
require("./config/mongodb");
require("./config/passport-conf")(passport);

// Middleware imports
const { notFound, handleError } = require("./middleware/errors");
const { auth } = require("./middleware/auth");

// routes
const m_auth = require("./Routes/Auth.router");
const m_projects = require("./Routes/Projects.router");

// Init port
const m_port = parseInt(process.env.PORT, 10) || 8000;

// Init app
const m_app = express();

// Disable headers
m_app.disable("x-powered-by");

//Middleware
m_app.use(express.json({ type: "application/json" }));
m_app.use(passport.initialize());

// Routes
m_app.use("/api/auth", m_auth);
m_app.use("/api/projects", auth, m_projects);

// Route does not exist
m_app.use(notFound);

// Handle all routes
m_app.use(handleError);

// Start server
if (process.env.NODE_ENV !== "test") {
  m_app.listen(m_port, () => {
    console.log("API is live...");
  });
} else {
  module.exports = { m_app };
}
