/** Express app for jobly. */

const express = require("express");
const app = express();
const ExpressError = require("./helpers/expressError");
const companiesRoute = require("./routes/companyRoutes");
const jobsRoute = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");

const morgan = require("morgan");

app.use(express.json());

// add logging system
app.use(morgan("tiny"));

// Use routes
app.use("/companies", companiesRoute);
app.use("/jobs", jobsRoute);
app.use("/users", userRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
