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