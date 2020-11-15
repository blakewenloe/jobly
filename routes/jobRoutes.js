const Router = require("express").Router;
const router = new Router();
const ExpressError = require("../helpers/expressError");
const { validate } = require("jsonschema");
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const Job = require("../models/job");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");

// Get list of jobs.
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const jobs = await Job.getAllJobs(req.query);
    return res.status(200).json({ jobs: jobs });
  } catch (err) {
    return next(err);
  }
});

// Get job by id.
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const job = await Job.getJob(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

// Update a job.
router.patch("/:id", ensureAdmin, async (req, res, next) => {
  try {
    if ("id" in req.body) {
      throw new ExpressError("You are not allowed to change the ID", 400);
    }

    const validation = validate(req.body, jobUpdateSchema);
    if (!validation.valid) {
      throw new ExpressError(
        validation.errors.map((e) => e.stack),
        400
      );
    }

    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

// Create a job
router.post("/", ensureLoggedIn, async (req, res, next) => {
  const result = validate(req.body, jobNewSchema);
  if (!result.valid) {
    const listOfErrors = result.errors.map((error) => error.stack);
    const error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
    const newJob = await Job.addJob(req.body);
    return res.status(201).json({ job: newJob });
  } catch (err) {
    return next(err);
  }
});

//Apply to a job
router.post("/:id/apply", ensureLoggedIn, async (req, res, next) => {
  try {
    const userName = req.body.username;
    const jobId = req.params.id;
    const application = await Job.applyToJob(userName, jobId);
    return res.status(201).json({ message: application });
  } catch (err) {
    return next(err);
  }
});

// Delete a job
router.delete("/:id", ensureAdmin, async (req, res, next) => {
  try {
    await Job.deleteJob(req.params.id);
    return res.status(200).json({ message: `${req.params.id} deleted` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
