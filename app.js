/** Express app for jobly. */
const express = require("express");
const app = express();
const ExpressError = require("./helpers/expressError");
const companiesRoute = require("./routes/companyRoutes");
const jobsRoute = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/auth");
const { authenticateJWT } = require("./middleware/auth");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
app.use(express.json());

// add logging system
app.use(morgan("tiny"));

// Use middleware
app.use(authenticateJWT);
app.use(jwt());
// Use routes
app.use("/", authRoutes);
app.use("/companies", companiesRoute);
app.use("/jobs", jobsRoute);
app.use("/users", userRoutes);

/** 404 handler */
app.use((req, res, next) => {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
