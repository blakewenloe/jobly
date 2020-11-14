const Router = require("express").Router;
const router = new Router();
const db = require("../db");
const ExpressError = require("../helpers/ExpressError");
const User = require("../models/user");

// register user
router.post("/register", async function (req, res, next) {
  try {
    const registerUser = await User.register(req.body);

    return res.status(201).json(registerUser);
  } catch (err) {
    return next(err);
  }
});

// login user
router.post("/login", async function (req, res, next) {
  try {
    const login = await User.login(req.body);
    return res.status(200).json({ token: login });
    // throw new ExpressError("Invalid user/password", 400);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
