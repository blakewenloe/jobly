const Router = require("express").Router;
const router = new Router();
const Company = require("../models/company");

// Get list of companies.
router.get("/", async function (req, res, next) {
  try {
    let companies = await Company.getAll();
    return res.status(200).json({ companies: companies });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
