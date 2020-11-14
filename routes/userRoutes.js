const Router = require("express").Router;
const router = new Router();
const ExpressError = require("../helpers/ExpressError");
const jsonschema = require("jsonschema");
const userSchema = require("../schemas/userSchema.json");
const User = require("../models/user");

// Get list of users.
router.get("/", async (req, res, next) => {
  try {
    let users = await User.getAll(req.query);
    return res.status(200).json({ users: users });
  } catch (err) {
    return next(err);
  }
});

// Get user by username.
router.get("/:username", async (req, res, next) => {
  try {
    let user = await User.get(req.params.username);
    if (user.length === 0) {
      throw new ExpressError(`${req.params.username} not found`, 404);
    }
    return res.status(200).json({ user: user });
  } catch (err) {
    return next(err);
  }
});

// Update a user.
router.patch("/:username", async (req, res, next) => {
  const result = jsonschema.validate(req.body, userSchema);
  if (!result.valid) {
    // pass validation errors to error usernamer
    //  (the "stack" key is generally the most useful)
    let listOfErrors = result.errors.map((error) => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }
  try {
    let user = await User.update(req.params.username, req.body);
    return res.status(200).json({ user: user });
  } catch (err) {
    return next(err);
  }
});

// Create a user
router.post("/", async (req, res, next) => {
  const result = jsonschema.validate(req.body, userSchema);
  if (!result.valid) {
    // pass validation errors to error usernamer
    //  (the "stack" key is generally the most useful)
    let listOfErrors = result.errors.map((error) => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }
  try {
    let newUser = await User.add(req.body);
    return res.status(201).json({ user: newUser });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:username", async (req, res, next) => {
  try {
    await User.delete(req.params.username);
    return res.status(200).json({ message: `${req.params.username} deleted` });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
