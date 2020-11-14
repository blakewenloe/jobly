const Router = require("express").Router;
const router = new Router();
const ExpressError = require("../helpers/ExpressError");
const jsonschema = require("jsonschema");
const jobSchema = require("../schemas/jobSchema.json");
const Job = require("../models/job");
const { ensureLoggedIn } = require("../middleware/auth");

// Get list of jobs.
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    let jobs = await Job.getAll(req.query);
    return res.status(200).json({ jobs: jobs });
  } catch (err) {
    return next(err);
  }
});

// Get job by id.
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    let job = await Job.get(req.params.id);
    if (job.length === 0) {
      throw new ExpressError(`${req.params.id} not found`, 404);
    } else {
      return res.status(200).json({ job: job });
    }
  } catch (err) {
    return next(err);
  }
});

// Update a job.
router.patch("/:id", async (req, res, next) => {
  const result = jsonschema.validate(req.body, jobSchema);
  if (!result.valid) {
    // pass validation errors to error idr
    //  (the "stack" key is generally the most useful)
    let listOfErrors = result.errors.map((error) => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }
  try {
    let job = await Job.update(req.params.id, req.body);
    return res.status(200).json({ job: job });
  } catch (err) {
    return next(err);
  }
});

// Create a job
router.post("/", async (req, res, next) => {
  const result = jsonschema.validate(req.body, jobSchema);
  if (!result.valid) {
    // pass validation errors to error idr
    //  (the "stack" key is generally the most useful)
    let listOfErrors = result.errors.map((error) => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }
  try {
    let newJob = await Job.add(req.body);
    return res.status(201).json({ job: newJob });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Job.delete(req.params.id);
    return res.status(200).json({ message: `${req.params.id} deleted` });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
