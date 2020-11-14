const Router = require("express").Router;
const router = new Router();
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
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
