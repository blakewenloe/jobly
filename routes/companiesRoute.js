const Router = require("express").Router;
const router = new Router();
const Company = require("../models/company");

// Get list of companies.
router.get("/", async function (req, res, next) {
  try {
    let companies = await Company.getAll(req.query);
    return res.status(200).json({ companies: companies });
  } catch (err) {
    return next(err);
  }
});

// Get company by handle.
router.get("/:handle", async function (req, res, next) {
  try {
    let company = await Company.get(req.params.handle);
    return res.status(200).json({ company: company });
  } catch (err) {
    return next(err);
  }
});

// Update a company.
router.patch("/:handle", async function (req, res, next) {
  try {
    let company = await Company.update(req.params.handle, req.body);
    return res.status(200).json({ company: company });
  } catch (err) {
    return next(err);
  }
});

// Create a company
router.post("/", async function (req, res, next) {
  try {
    let newCompany = await Company.add(req.body);
    return res.status(201).json({ company: newCompany });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
