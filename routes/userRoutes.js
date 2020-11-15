const Router = require("express").Router;
const router = new Router();
const ExpressError = require("../helpers/expressError");
const { validate } = require("jsonschema");
const userNewSchema = require("../schemas/userUpdate.json");
const userUpdateSchema = require("../schemas/userNew.json");

const User = require("../models/user");
const { ensureCorrectUser } = require("../middleware/auth");

// Get list of users.
router.get("/", async (req, res, next) => {
  try {
    let users = await User.getUsers();
    return res.status(200).json({ users: users });
  } catch (err) {
    return next(err);
  }
});

// Get user by username.
router.get("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    let user = await User.getUser(req.params.username);
    if (user.length === 0) {
      throw new ExpressError(`${req.params.username} not found`, 404);
    }
    return res.status(200).json({ user: user });
  } catch (err) {
    return next(err);
  }
});

// Update a user.
router.patch("/:username", ensureCorrectUser, async (req, res, next) => {
  const result = validate(req.body, userUpdateSchema);
  if (!result.valid) {
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
  const result = validate(req.body, userNewSchema);
  if (!result.valid) {
    // pass validation errors to error username
    //  (the "stack" key is generally the most useful)
    let listOfErrors = result.errors.map((error) => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  try {
    let newUser = await User.register(req.body);
    return res.status(201).json({ user: newUser });
  } catch (err) {
    return next(err);
  }
});

//Delete a user
router.delete("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    await User.delete(req.params.username);
    return res.status(200).json({ message: `${req.params.username} deleted` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
