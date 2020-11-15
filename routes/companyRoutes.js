const Router = require("express").Router;
const router = new Router();
const ExpressError = require("../helpers/ExpressError");
const { validate } = require("jsonschema");
const companyUpdateSchema = require("../schemas/companyUpdate.json");
const companyNewSchema = require("../schemas/companyNew.json");
const Company = require("../models/company");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

// Get list of companies.
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    let companies = await Company.getCompanies(req.query);
    return res.status(200).json({ companies: companies });
  } catch (err) {
    return next(err);
  }
});

// Get company by handle.
router.get("/:handle", ensureLoggedIn, async (req, res, next) => {
  try {
    let company = await Company.getCompany(req.params.handle);
    if (company) {
      return res.status(200).json({ company: company });
    }
  } catch (err) {
    return next(err);
  }
});

// Update a company.
router.patch("/:handle", ensureAdmin, async (req, res, next) => {
  try {
    if ("handle" in req.body) {
      throw new ExpressError("You are not allowed to change the handle.", 400);
    }

    const validation = validate(req.body, companyUpdateSchema);
    if (!validation.valid) {
      throw new ExpressError(
        validation.errors.map((e) => e.stack),
        400
      );
    }

    const company = await Company.updateCompany(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

// Create a company
router.post("/", ensureAdmin, async (req, res, next) => {
  const result = validate(req.body, companyNewSchema);
  if (!result.valid) {
    let listOfErrors = result.errors.map((error) => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
    let newCompany = await Company.addCompany(req.body);
    return res.status(201).json({ company: newCompany });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:handle", ensureAdmin, async (req, res, next) => {
  try {
    await Company.deleteCompany(req.params.handle);
    return res.status(200).json({ message: `${req.params.handle} deleted` });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
