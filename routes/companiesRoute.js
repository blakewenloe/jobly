const Router = require("express").Router;
const router = new Router();
const Company = require("../models/company");

// Get list of companies.
router.get("/", async (req, res, next) => {
  try {
    let companies = await Company.getAll(req.query);
    return res.status(200).json({ companies: companies });
  } catch (err) {
    return next(err);
  }
});

// Get company by handle.
router.get("/:handle", async (req, res, next) => {
  try {
    let company = await Company.get(req.params.handle);
    return res.status(200).json({ company: company });
  } catch (err) {
    return next(err);
  }
});

// Update a company.
router.patch("/:handle", async (req, res, next) => {
  try {
    let company = await Company.update(req.params.handle, req.body);
    return res.status(200).json({ company: company });
  } catch (err) {
    return next(err);
  }
});

// Create a company
router.post("/", async (req, res, next) => {
  try {
    let newCompany = await Company.add(req.body);
    return res.status(201).json({ company: newCompany });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:handle", async (req, res, next) => {
  try {
    await Company.delete(req.params.handle);
    return res.status(200).json({ message: `${req.params.handle} deleted` });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
